const sinonimos = require('node-sinonimos');
const path = require('path');
const Database = require('./database');


const dictionaryPath = path.join(__dirname, '../files/synonyms.json');
const database = new Database(dictionaryPath);

exports.get = async function (word)
{
  let synonyms = database.getValue(word);

  if (synonyms === null)
  {
    console.log('synonyms: searching %s', word);
    synonyms = await sinonimos(word);
    database.setValue(word, synonyms);
  }
  else {
    console.log('synonyms: getting %s', word);
  }

  return synonyms;
}