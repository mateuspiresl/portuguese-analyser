const lexical = require('../src/lexical');
const syntactic = require('../src/syntactic');
const classification = require('../src/classification');


async function test(text) {
  console.log('test: %s', text);
  syntactic(await lexical.break(text));
}

async function fail(text) {
  try {
    await test(text);
  }
  catch (error) {
    return console.log('EXPECTED', error);
  }

  throw new Error('Should have thrown an exception');
}


(async () => {

try {
  await test('os felizes amigos de João brincam de bola de gude semanalmente.');
  await test('os amigos de João brincam de bola de gude semanalmente.');
  await test('amigos de João brincam de bola de gude semanalmente.');
  await test('amigos brincam de bola de gude semanalmente.');
  await test('amigos brincam de bola semanalmente.');
  await test('amigos brincam de bola.');
  await test('amigos brincam.');
  // await test('olá, meu nome é mateus. qual o seu nome?');
  // await fail('olá, meu nome é mateus. qual o seu nome');
  // await fail('olá,, meu nome é mateus. qual o seu nome');

  console.log('Success!');
}
catch (error) {
  console.error(error);
}

})();