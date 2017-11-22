/**
 * Filters an array using an async predicate.
 * @param {Array} data The array to filter.
 * @param {function} predicate The async predicate.
 * @return {Promise<Array>} The filtered array.
 */
exports.filterAsync = function (data, predicate)
{
  // Transform all the elements into an array of promises using the predicate
  // as the promise
  return Promise.all(data.map((element, index) => {
    console.log('UTIL.FILTER.CALL', element);
    return predicate(element, index, data);
  }))
    // Use the result of the promises to call the underlying sync filter
    // function
    .then(result => {
      console.log('UTIL.FILTER.RES', result);
      data.filter((element, index) => result[index]);
    });
}

exports.reduceAsync = async function (data, callback, result, index)
{
  if (index >= data.length) return result;

  if (result === undefined)
  {
    result = data[0];
    index = 1;
  }
  else if (index === undefined) {
    index = 0;
  }

  const callResult = await callback(result, data[index], index, data);
  return exports.reduceAsync(data, callback, callResult, index + 1);
};

exports.forEachAsync = async function (data, callback)
{
  for (let i = 0; i < data.length; i++)
    if ((await callback(data[i], i)) === false)
      return;
}


// Array prototype

Array.prototype.filterAsync = function (callback) {
  return exports.filterAsync(this, callback)
}

Array.prototype.reduceAsync = function (callback, result) {
  return exports.reduceAsync(this, callback, result);
};

Array.prototype.forEachAsync = function (callback) {
  return exports.forEachAsync(this, callback);
};

Array.prototype.forEach = function (callback) {
  for (let i = 0; i < this.length; i++)
    if (callback(this[i], i) === false)
      return;
};