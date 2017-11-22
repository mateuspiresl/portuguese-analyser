const lexical = require('./lexical');
const syntactic = require('./syntactic');
const synonyms = require('./synonyms');
const rebuild = require('./rebuilder');
const classification = require('./classification');
const util = require('./util');


module.exports = async function (text)
{
  const phrases = await rebuild(text);
  const result = [];

  await phrases.forEachAsync(async phrase => {
    (await synonyms.generate(phrase))
      .forEach(phrase => {
        const text = phrase.join(' ')
          .replace(' ,', ',').replace(' .', '.')
          .replace(' !', '!').replace(' ?', '?');
        
        result.push(text);
      });
  });

  return result;
}