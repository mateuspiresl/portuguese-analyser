const rebuild = require('../src/rebuilder');
const classification = require('../src/classification');


Promise.resolve()

  .then(() => {
    const phrase = 'o menino Ademir sabe de android fuderosamente.';
    console.log(`\nRebuilding '${phrase}'`)
    return rebuild(phrase).then(console.log);
  })
  
  .then(() => {
    const phrase = 'o menino Ademir sabe de android.';
    console.log(`\nRebuilding '${phrase}'`)
    return rebuild(phrase).then(console.log);
  })

  .then(() => {
    const phrase = 'o menino Ademir sabe fuderosamente.';
    console.log(`\nRebuilding '${phrase}'`)
    return rebuild(phrase).then(console.log);
  })

  .then(() => {
    const phrase = 'o menino Ademir sabe.';
    console.log(`\nRebuilding '${phrase}'`)
    return rebuild(phrase).then(console.log);
  })

  .then(() => {
    const phrase = 'sabe de android fuderosamente.';
    console.log(`\nRebuilding '${phrase}'`)
    return rebuild(phrase).then(console.log);
  })

  .then(() => {
    const phrase = 'sabe de android.';
    console.log(`\nRebuilding '${phrase}'`)
    return rebuild(phrase).then(console.log);
  })

  .then(() => {
    const phrase = 'sabe fuderosamente.';
    console.log(`\nRebuilding '${phrase}'`)
    return rebuild(phrase).then(console.log);
  })

  .then(() => {
    const phrase = 'sabe.';
    console.log(`\nRebuilding '${phrase}'`)
    return rebuild(phrase).then(console.log);
  })

  .then(() => {
    const phrase = 'os felizes amigos de João brincam de bola de gude semanalmente.';
    console.log(`\nRebuilding '${phrase}'`)
    return rebuild(phrase).then(console.log);
  })
    
  .catch(console.error)
  .then(() => classification.classificator.close());