const _ = require('underscore');
const lexical = require('../src/lexical');
const classification = require('../src/classification');
const Class = classification.Class;


const text = 'Os felizes amigos de João brincam de bola de gude semanalmente.\nCoisa!';

Promise.resolve()
  .then(() => {
    console.log('Searching data of "' + text + '"');
    return lexical(text);
  })
  .then(data => {
    const expected = [
      { token: 'Os', class: classification.Article },
      { token: 'felizes', class: classification.Adjetive },
      { token: 'amigos', class: classification.Noun },
      { token: 'de', class: classification.Preposition },
      { token: 'João', class: classification.Noun },
      { token: 'brincam', class: classification.Verb },
      { token: 'de', class: classification.Preposition },
      { token: 'bola', class: classification.Noun },
      { token: 'de', class: classification.Preposition },
      { token: 'gude', class: classification.Noun },
      { token: 'semanalmente', class: classification.Adverb },
      { token: '.', class: classification.Punctuation },
      { token: 'Coisa', class: classification.Noun },
      { token: '!', class: classification.Punctuation }
    ];

    if (_.isEqual(data, expected))
      console.log('Success!');
    else {
      console.log('Data:', JSON.stringify(data));
      console.log('\nExpected:', JSON.stringify(expected));
      console.log('\nError!');
    }
  })
  .catch(console.error)
  .then(() => classification.classificator.close());