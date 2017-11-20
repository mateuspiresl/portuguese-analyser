const path = require('path');
const fs = require('fs');
const dicio = require('./api/dicio');
const Database = require('./database');


const DEBUG = false;
const logger = {};
logger.log = (...args) => { if (DEBUG) console.log(...args) };
logger.error = (...args) => { if (DEBUG) console.error(...args) };

const dictionaryPath = path.join(__dirname, '../files/classification.json');
const database = new Database(dictionaryPath);

class Class
{
  constructor (name, detailed)
  {
    if (typeof name === 'object') {
      this.name = name.name;
      this.detailed = name.detailed;
    }
    else {
      this.name = name;
    }
  
    if (detailed) this.detailed = detailed;
  }

  equals (clas) { return this.name === clas.name }
  is (clas) { return clas.indexOf(this.name) >= 0 }
  toString () { return this.name }
}

function shouldInsert (classification, toInsert)
{
  let shouldNot;
  classification.forEach(clas => !(shouldNot = clas.equals(toInsert)));
  return !shouldNot;
}

exports.Class = Class;
exports.Punctuation = new Class('$');
exports.Article = new Class('artigo');
exports.Verb = new Class('verbo');
exports.Adverb = new Class('advérbio');
exports.Noun = new Class('substantivo');
exports.Adjetive = new Class('adjetivo');
exports.Preposition = new Class('preposição');
exports.classes = [exports.Article, exports.Verb, exports.Adverb, exports.Noun, exports.Adjetive, exports.Preposition];

exports.getClasses = async function (word)
{
  let classification = database.getValue(word);

  if (classification === null) try
  {
    logger.log('classification: searching %s', word);
    const rawClassification = await dicio.getClasses(word);

    classification = [];
    
    if (rawClassification !== null) {
      rawClassification.forEach(raw => {
        exports.classes.forEach(clas => {
          if (clas.is(raw))
          {
            if (shouldInsert(classification, clas))
              classification.push(new Class(clas, raw));
            
            return false;
          }
        });
      });
    }
    
    if (classification.length === 0)
      classification.push(exports.Noun);

    database.setValue(word, classification);
  }
  catch (error) {
    return [];
  }
  else {
    logger.log('classification: getting %s', word);
    classification = classification.map(clas => new Class(clas));
  }

  return classification;
}