const _ = require('underscore');
const classification = require('../src/classification');


Promise.resolve()
  .then(() => {
    console.log('Searching class of "a"');
    return classification.getClass('a');
  })
  .then(classes => {
    const expected = ['artigo', 'pronome', 'substantivo'];

    if (!_.isEqual("" + classes, "" + expected))
      throw new Error('The class of "a" is wrong: got ' + classes + ', expected ' + expected);

    console.log('Success! (%s)', classes);
  })
  .catch(error => console.error('Error', error));