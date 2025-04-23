import fs from 'fs';

console.log('Start');

fs.readFile('test.txt', 'utf8', (err, data) => {
    console.log(data);
}); // Non-blocking 

console.log('End'); 