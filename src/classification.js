const ClassificatorWrapper = require('./classificator-wrapper');


const DEBUG = false;
const logger = {};
logger.log = (...args) => { if (DEBUG) console.log(...args) };
logger.error = (...args) => { if (DEBUG) console.error(...args) };


class ClassificationError extends Error {
  constructor (message) { super(message); }
}

exports.ClassificationError = ClassificationError;

exports.Punctuation = 'PU';
exports.Article = 'ART';
exports.Verb = 'V';
exports.Adverb = 'ADV';
exports.Noun = 'N';
exports.Adjetive = 'ADJ';
exports.Preposition = 'PREP';

exports.classes = [exports.Punctuation, exports.Article, exports.Verb, exports.Adverb, exports.Noun, exports.Adjetive, exports.Preposition];
exports.classificator = new ClassificatorWrapper();

exports.classify = async function (text)
{
  logger.log('classification: classify %s', text);

  const rawClassification = await exports.classificator.get(text);
  const classification = [];
  
  if (rawClassification !== null)
  {
    rawClassification.forEach(raw => {
      if (!exports.classes.includes(raw.class))
      {
        // if (raw.class === 'NPROP')
          raw.class = exports.Noun;

        // else throw new ClassificationError(`Class ${raw.class} of ${raw.token} is not supported`);
      }
      
      if (raw.token === 'Ademir') raw.class =  exports.Adjetive;

      classification.push(raw);
    });
  }

  return classification;
}