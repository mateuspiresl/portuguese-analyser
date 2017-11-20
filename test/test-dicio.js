const _ = require('underscore');
const dicio = require('../src/api/dicio');


function getOf(word, expected)
{
  console.log('Searching class of "%s"', word);
  return dicio.getClasses(word)
    .then(classes => {
      if (!_.isEqual(classes, expected))
        throw new Error(`The class of "${word}" is wrong: got ${classes}, expected ${expected}`);

      console.log('Success (%s)!', classes);
    });
}

Promise.resolve()
  .then(() => getOf('felizes', ['adjetivo de dois gêneros']))
  .then(() => getOf('os', ['pronome', 'artigo definido']))
  .then(() => getOf('semanalmente', ['advérbio']))
  .then(() => getOf('a', ['artigo definido', 'numeral', 'preposição', 'pronome demonstrativo', 'pronome pessoal', 'substantivo masculino']))
  .then(() => getOf('casa', ['substantivo feminino', 'substantivo masculino']))
  .then(() => getOf('fôrma', ['substantivo feminino']))
  .then(() => getOf('é', ['substantivo masculino', 'verbo intransitivo', 'verbo predicativo']))
  .catch(console.error);