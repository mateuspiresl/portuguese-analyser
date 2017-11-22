const _ = require('underscore');
const synonyms = require('../src/synonyms');


Promise.resolve()

  .then(() => {
    const text = 'casa';
    console.log(`Searching synonyms of '${text}'`);
    return synonyms.get(text);
  })
  .then(synonyms => {
    const expected = ['residência', 'habitação', 'domicílio', 'vivenda', 'moradia', 'morada', 'lar', 'companhia', 'empresa', 'agremiação', 'associação', 'classe', 'dinastia', 'estirpe', 'família', 'linhagem', 'geração', 'loja', 'edifício', 'supermercado', 'mercado', 'armazém', 'estabelecimento', 'convento', 'mosteiro', 'igreja', 'subdivisão', 'botoeira', 'espaço', 'divisão', 'fenda', 'abertura', 'assistência', 'público', 'teatro', 'cinema', 'plateia', 'década', 'decênio', 'decenário'];

    if (!_.isEqual(synonyms, expected))
      throw new Error('Sinonims of "casa" are not equal: got ' + synonyms + ', expected ' + expected);

    console.log('Success!');
  })

  .then(() => {
    const text = 'é a casa';
    console.log(`Generating synonyms permutation of '${text}'`);
    return synonyms.generate(text);
  })
  .then(synonyms => {
    const expected = ['é a residência', 'é a habitação', 'é a domicílio', 'é a vivenda', 'é a moradia', 'é a morada', 'é a lar', 'é a companhia', 'é a empresa', 'é a agremiação', 'é a associação', 'é a classe', 'é a dinastia', 'é a estirpe', 'é a família', 'é a linhagem', 'é a geração', 'é a loja', 'é a edifício', 'é a supermercado', 'é a mercado', 'é a armazém', 'é a estabelecimento', 'é a convento', 'é a mosteiro', 'é a igreja', 'é a subdivisão', 'é a botoeira', 'é a espaço', 'é a divisão', 'é a fenda', 'é a abertura', 'é a assistência', 'é a público', 'é a teatro', 'é a cinema', 'é a plateia', 'é a década', 'é a decênio', 'é a decenário'];

    if (!_.isEqual(synonyms, expected))
      throw new Error('Sinonims are not equal: got ' + synonyms + ', expected ' + expected);

    console.log('Success!');
  })

  .catch(console.error);