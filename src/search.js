const google = require('google')
google.resultsPerPage = 25


let nextCounter = 0

google('node.js best practices', (err, res) => {
  if (err) return console.error(err);

  for (let i = 0; i < res.links.length; ++i) {
    let link = res.links[i];
    console.log(link.title + ' - ' + link.href)
    console.log(link.description + "\n")
  }

  if (nextCounter < 4) {
    nextCounter += 1
    if (res.next) res.next()
  }
});