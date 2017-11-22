const lexical = require('../src/lexical');
const syntactic = require('../src/syntactic');
const classification = require('../src/classification');


async function test(text) {
  console.log('test: %s', text);
  syntactic.analyse(await lexical(text));
}

async function fail(text) {
  try {
    await test(text);
  }
  catch (error) {
    console.log('THIS IS EXPECTED \\/');
    console.log('\t', error);
    console.log('THIS IS EXPECTED /\\');
    return;
  }

  throw new Error('Should have thrown an exception');
}


(async () => {

try {
  await test('os feitos de hobbit são os grandiosos feitos.');
  await test('os felizes amigos de João brincam de bola de gude semanalmente.');
  await test('os amigos de João brincam de bola de gude semanalmente.');
  await test('amigos de João brincam de bola de gude semanalmente.');
  await test('amigos brincam de bola de gude semanalmente.');
  await test('amigos brincam de bola semanalmente.');
  await test('amigos brincam de bola.');
  await test('amigos brincam.');
  await test('brincam de bola.');
  
  await fail('amigos de João brincam de bola de gude semanalmente');
  await fail('amigos de João brincam bola de gude semanalmente.');
  await fail('os felizes amigos de João rapidamente brincam de feias bolas de horrorosos gude semanalmente.');

  console.log('Success!');
}
catch (error) {
  console.error(error);
}

classification.classificator.close();

})();