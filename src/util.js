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
  return Promise.all(data.map((element, index) => predicate(element, index, data)))
    // Use the result of the promises to call the underlying sync filter
    // function
    .then(result => data.filter((element, index) => result[index]));
}

async function reduceAsync(data, callback, result, index)
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
  return reduceAsync(data, callback, callResult, index + 1);
}
exports.reduceAsync = reduceAsync;