const Database = require('../src/database');
const path = require('path');


function test (a, b) {
  if (a !== b) throw new Error('Test failed');
}

const dbPath = path.join(__dirname, '../files/test.json');

console.log('Creating database');
const db = new Database(dbPath);

console.log('Adding pair um -> dois');
db.setValue('um', 'dois');

console.log('Acessing pair um -> dois');
test(db.getValue('um'), 'dois');

console.log('Adding pair a -> b');
db.setValue('a', 'b');

console.log('Acessing keys');
test(db.getValue('um'), 'dois');
test(db.getValue('a'), 'b');

console.log('Loading database');
const db2 = new Database(dbPath);

console.log('Acessing valid keys');
test(db2.getValue('um'), 'dois');
test(db2.getValue('a'), 'b');

console.log('Reseting database');
db2.reset();

const db3 = new Database(dbPath);

console.log('Acessing invalid keys');
test(db3.getValue('um'), null);
test(db3.getValue('a'), null);

console.log('Success!');