const classification = require('./classification');
const util = require('./util');


const alowed = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ,.?!\s]+$/;

async function innerSplit(tokens, token)
{
  (await classification.classify(token))
    .forEach(token => tokens.push(token));
  
  return tokens;
}

module.exports = function (text)
{
  if (!alowed.test(text)) throw new Error('Has invalid symbol');
  return util.reduceAsync(text.split(/\n+/), innerSplit, []);
}