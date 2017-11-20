const factCheck = require('../src/fact-check');


factCheck.build('o ataque às torres gemeas foi uma farsa')
  .then(result => result.forEach((text, index) => console.log(index, text)))
  .catch(console.error);