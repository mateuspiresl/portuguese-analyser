const _ = require('underscore');
const sinonimos = require('node-sinonimos');
const path = require('path');
const Database = require('./database');
const lexical = require('./lexical');
const classification = require('./classification');


const dictionaryPath = path.join(__dirname, '../files/synonyms.json');
const database = new Database(dictionaryPath);

const changeableClasses = [
  classification.Noun,
  classification.Adjetive,
  classification.Verb,
  classification.Adverb,
];

exports.get = async function (word)
{
  let synonyms = database.getValue(word);

  if (synonyms === null)
  {
    // console.log('synonyms: searching %s', word);
    const wordClass = (await classification.classify(word))[0].class;

    const rawSynonyms = await sinonimos(word);
    synonyms = [];

    await rawSynonyms.forEachAsync(
      async synonym => {
        const pair = await classification.classify(synonym);
        if (pair.length === 0) return;

        const clas = pair[0].class;
        if (clas === wordClass && changeableClasses.includes(clas))
          synonyms.push(synonym);
      });
    
    database.setValue(word, synonyms);
  }
  else {
    // console.log('synonyms: getting %s', word);
  }

  return synonyms;
}

function permute(words, synonyms, index, result)
{
  if (index === undefined) {
    index = 0;
    result = [];
  }

  while (index < synonyms.length) {
    if (synonyms[index])
    {
      synonyms[index].forEach(synonym => {
        const clone = _.clone(words);
        clone[index] = synonym;
        result.push(clone);

        permute(clone, synonyms, index + 1, result);
      });
  
      permute(words, synonyms, index + 1, result);
    }

    index++;
  }

  return result;
}

exports.generate = async function (text)
{
  const pairs = await lexical(text);
  const map = pairs.map((pair, i) => {
    return changeableClasses.includes(pair.class);
  });
  
  await pairs.forEachAsync(async (pair, i) => {
    if (map[i]) map[i] = await exports.get(pair.token);
  });

  return permute(pairs.map(pair => pair.token), map);
}