const lexical = require('./lexical');
const synonyms = require('./synonyms');
const classification = require('./classification');
const util = require('./util');


function permute(text, synonyms, index, result)
{
  if (index === undefined) {
    index = 0;
    result = [];
  }

  while (index < synonyms.length)
  {
    const word = synonyms[index].word;

    synonyms[index].synonyms.forEach(synonym => {
      const textResult = text.replace(word, synonym);
      result.push(textResult);
      permute(textResult, synonyms, index + 1, result);
    });

    permute(text, synonyms, index + 1, result);
    index++;
  }

  return result;
}


exports.build = async function (text)
{
  const words = lexical.onlyWords(text);
  const wordsSynonyms = [];

  for (let w in words) {
    const word = words[w];

    try {
      const wordClass = await classification.getClass(word);

      try {
        // Get the synonyms of the current word
        const notFilteredWordSynonyms = await synonyms.get(word);

        // Filter by the ones which has the same class of the word
        const wordSynonyms = await util.filterAsync(notFilteredWordSynonyms,
          async synonym => {
            try {
              return (await classification.getClass(synonym)) === wordClass;
            }
            catch (error) {
              return false;
            }
          });

        wordsSynonyms.push({ word, synonyms: wordSynonyms });
      } catch (error) { }
    }
    catch (error) { }
  }
  
  return permute(text, wordsSynonyms);
}