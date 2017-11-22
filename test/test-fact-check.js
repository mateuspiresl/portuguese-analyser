const factCheck = require('../src/fact-check');
const classification = require('../src/classification');


factCheck('o ataque foi uma farsa.')
  .then(result => result.forEach((text, index) => console.log(text)))
  .catch(console.error)
  .then(() => classification.classificator.close());