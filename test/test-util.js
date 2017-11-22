const _ = require('underscore');
const util = require('../src/util');


(async () => {
  const array = [1, 3, 4, 6, 8, 9];

  try {
    console.log('Filtering');
    const filterResult = await array.filterAsync(async v => {
      return v >= 6;
    });
    console.log(_.isEqual(filterResult, array.slice(3, 6)) ? 'Success!' : 'Error!');

    console.log('Reducing');
    const reduceResult = await array.reduceAsync(async (r, v) => {
      r.push(v); return r;
    }, []);
    console.log(_.isEqual(reduceResult, array) ? 'Success!' : 'Error!');

    console.log('ForEach');
    let count = 0;
    await array.forEachAsync(async (v, i) => {
      return count++ === i;
    });
    console.log(count === 6 ? 'Success!' : 'Error!');

    console.log('ForEach (sync)');
    count = 0;
    array.forEach((v, i) => count++ < 3);
    console.log(count === 4 ? 'Success!' : 'Error!');
  }
  catch (error) {
    console.error(error);
  }
})();