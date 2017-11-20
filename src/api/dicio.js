const request = require('request-promise');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');


const DEBUG = false;
const logger = {};
logger.log = (...args) => { if (DEBUG) console.log(...args) };
logger.error = (...args) => { if (DEBUG) console.error(...args) };

const address = 'https://www.dicio.com.br/';
const timeout = 3000;

function parseSearch(word, $)
{
  logger.log('dicio:', 'parse search', word);

  const elements = $('.resultados:first-of-type a');
  
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].children[0].data === word)
    {
      const redirectionLocation = elements[i].attribs.href;
      const redirection = redirectionLocation.substr(1, redirectionLocation.length - 2);
      return redirection;
    }
  }
  
  return null;
}

function parseGet(word, $)
{
  logger.log('dicio:', 'parse get', word);

  if ($('h1').text() !== word) return null;
    // throw new Error(`The search for "${word}" got a wrong result: ${$('h1').text()}`);

  const reference = $('p.significado span').text();
  const prefix = word + ' vem do verbo ';

  if (reference.toLowerCase().startsWith(prefix))
    return search(reference.substring(prefix.length, reference.indexOf('.')));
  else {
    const classesElement = $('p.adicional:not(.sinonimos)');
    const title = classesElement.text().trim();
    const isGrammarClass = title.startsWith('Classe gramatical:');
    const classes = [];

    if (classesElement.length > 0 && isGrammarClass) {
      const tokens = $('b, br', classesElement[0]);

      tokens.each((index, token) => {
        if (token.name === 'br') return false;
        classes.push($(token).text());
      });
    }

    const topClass = $('span.cl');
    if (topClass.length > 0)
    {
      topClass[0].children[0].data.split(',').forEach(clas => {
        clas = clas.trim();
        if (!classes.includes(clas)) classes.push(clas);
      });
    }
    
    return classes;
  }
}

function makeRequest(call, maxRetry=100, retry=0)
{
  return call()
    .catch(error => {
      if (error.name === 'RequestError' && retry < maxRetry) {
        logger.log('dicio:', 'retry');
        return makeRequest(call, maxRetry, retry + 1);
      }
      else throw error;
    });
}

function get(word, redirection)
{
  logger.log('dicio:', 'get', word, redirection);
  if (redirection === undefined) redirection = word;

  const call = () => request.get({
    url: address + redirection,
    encoding: null,
    timeout
  });

  return makeRequest(call)
    .then(body => iconv.decode(body, 'iso-8859-1'))
    .then(cheerio.load)
    .then($ => parseGet(word, $));
}

function search(word)
{
  logger.log('dicio:', 'search', word);

  const call = () => request.get({
    url: address + 'pesquisa.php',
    qs: { q: word },
    encoding: null,
    timeout
  });

  return makeRequest(call)
    .then(body => iconv.decode(body, 'iso-8859-1'))
    .then(cheerio.load)
    .then($ => {
      const redirection = parseSearch(word, $);

      if (redirection === null)
        return parseGet(word, $);
      else
        return get(word, redirection);
    });
}


exports.getClasses = function (word) {
  return search(word);
}