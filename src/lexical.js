const classification = require('./classification');
const util = require('./util');


const alowed = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ,.?!\s]+$/;
const letters = /[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+/;
const notLetters = /,|\.|\?|!/;

async function appendClass(token)
{
  let tokenClass = [classification.Punctuation];
  
  if (!notLetters.test(token))
    tokenClass = await classification.getClasses(token);
  
  return { token, class: tokenClass };
}

async function innerSplit(tokens, token)
{
  const match = token.match(notLetters);

  if (match === null) {
    tokens.push(await appendClass(token));
  }
  else
  {
    let length;
    if (match.index === 0) length = token.startsWith('...') ? 3 : 1;
    else length = match.index;
    
    tokens.push(await appendClass(token.substr(0, length)));
    
    if (token.length > length)
      return innerSplit(tokens, token.substr(length, token.length));
  }

  return tokens;
}

exports.break = function (text) {
  if (!alowed.test(text)) throw new Error('Invalid symbol'); 
  return util.reduceAsync(text.split(/\s+/), innerSplit, []);
}

exports.onlyWords = async function (text) {
  return (await exports.break(text))
    .filter(result => !notLetters.test(result.token));
}