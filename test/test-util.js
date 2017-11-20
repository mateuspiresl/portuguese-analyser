const _ = require('underscore');
const util = require('../src/util');


(async () => {
  const array = [1, 3, 4, 6, 8, 9];

  try {
    console.log('Filtering');
    const filterResult = await util.filterAsync(array, async v => {
      return v >= 6;
    });
    console.log(_.isEqual(filterResult, array.slice(3, 6)) ? 'Success!' : 'Error!');

    console.log('Reducing');
    const reduceResult = await util.reduceAsync(array, async (r, v) => {
      r.push(v); return r;
    }, []);
    console.log(_.isEqual(reduceResult, array) ? 'Success!' : 'Error!');
  }
  catch (error) {
    console.error(error);
  }
})();