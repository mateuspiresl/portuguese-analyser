const _ = require('underscore');
const lexical = require('../src/lexical');


function createLogMethod(method) {
  return function () {
    const parsedArguments = [];

    for (let i in arguments)
      if (typeof arguments[i] === 'object' && !(arguments[i] instanceof Error))
        parsedArguments.push('*' + JSON.stringify(arguments[i]));
      else
        parsedArguments.push(arguments[i]);

    method(...parsedArguments);
  }
}

console._log = console.log;
console._error = console.error;

console.log = createLogMethod(console.log.bind(console));
console.error = createLogMethod(console.error.bind(console));


const text = 'olá! meu nome é mateus pires. como vai você? eu vou bem. ta, xau';
const expected = [
  'olá', '!', 'meu', 'nome', 'é', 'mateus', 'pires', '.', 'como',
  'vai', 'você', '?', 'eu', 'vou', 'bem', '.', 'ta', ',', 'xau'
];
const expectedOnlyWords = [
  'olá', 'meu', 'nome', 'é', 'mateus', 'pires', 'como',
  'vai', 'você', 'eu', 'vou', 'bem', 'ta', 'xau'
];

(async () => {
  try {
    console.log('Breking:', text);
    const result = (await lexical.break(text)).map(result => result.token);
    
    if (_.isEqual(result, expected))
      console.log('Success!');
    else
      console.error('The text wasn\'t broke correctly.\nText: %s\nGot: %s\nExpected: %s',
        text, result, expected);

    console.log('Only words:', text);
    const resultOnlyWords = (await lexical.onlyWords(text)).map(result => result.token);
    
    if (_.isEqual(resultOnlyWords, expectedOnlyWords))
      console.log('Success!');
    else
      console.error('The text wasn\'t broke correctly.\nText: %s\nGot: %s\nExpected: %s',
        text, resultOnlyWords, expectedOnlyWords);

    const invalidSymbols = '$ * & "# @ -+- ~ [] ()';
    console.log('Invalid symbols:', invalidSymbols);
    try {
      await lexical.break(invalidSymbols);
      console.error('Invalid symbol wasn\'t notified');
    }
    catch (error) {
      console.log('Success!');
    }
  }
  catch (error) {
    console.error(error);
  }
})();