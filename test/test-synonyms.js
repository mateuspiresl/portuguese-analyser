const _ = require('underscore');
const synonyms = require('../src/synonyms');


Promise.resolve()
  .then(() => {
    console.log('Searching synonyms of "casa"');
    return synonyms.get('casa');
  })
  .then(synonyms => {
    const expected = ['residência', 'habitação', 'domicílio', 'vivenda', 'moradia', 'morada', 'lar', 'companhia', 'empresa', 'firma', 'agremiação', 'associação', 'classe', 'dinastia', 'estirpe', 'família', 'linhagem', 'geração', 'loja', 'edifício', 'supermercado', 'mercado', 'armazém', 'estabelecimento', 'convento', 'mosteiro', 'igreja', 'subdivisão', 'botoeira', 'espaço', 'divisão', 'fenda', 'abertura', 'assistência', 'público', 'teatro', 'cinema', 'plateia', 'década', 'decênio', 'decenário'];

    if (!_.isEqual(synonyms, expected))
      throw new Error('Sinonims of "casa" are not equal: got ' + synonyms + ', expected ' + expected);

    console.log('Success!');
  })
  .catch(error => console.error('Error', error));