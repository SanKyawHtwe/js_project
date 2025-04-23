import fs from 'fs';

console.log('Start');

const data = fs.readFileSync('test.txt', 'utf8'); // Blocking the main thread
console.log(data);


console.log('End');
