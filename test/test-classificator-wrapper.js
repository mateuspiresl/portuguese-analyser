const _ = require('underscore');
const ClassificatorWrapper = require('../src/classificator-wrapper');


const classif = new ClassificatorWrapper();

classif.get('Os felizes amigos de João brincam de bola de gude semanalmente.')
  .then(data => {
    const expected = [
      { token: 'Os', class: 'ART' },
      { token: 'felizes', class: 'ADJ' },
      { token: 'amigos', class: 'N' },
      { token: 'de', class: 'PREP' },
      { token: 'João', class: 'NPROP' },
      { token: 'brincam', class: 'V' },
      { token: 'de', class: 'PREP' },
      { token: 'bola', class: 'N' },
      { token: 'de', class: 'PREP' },
      { token: 'gude', class: 'N' },
      { token: 'semanalmente', class: 'ADV' },
      { token: '.', class: 'PU' }
    ];

    if (_.isEqual(data, expected))
      console.log('Success!');
    else {
      console.log('Data:', JSON.stringify(data));
      console.log('\nExpected:', JSON.stringify(expected));
      console.log('\nError!');
    }
  })
  .then(() => classif.close());