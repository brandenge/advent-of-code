const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./1-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n');

const regex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;
let sum = 0

const digits = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9'
};

for (const line of lines) {
  const results = [...line.matchAll(regex)];
  if (results.length == 0) continue;
  let firstDigit = results[0][1];
  if (firstDigit in digits) firstDigit = digits[firstDigit];
  let lastDigit = results.at(-1)[1];
  if (lastDigit in digits) lastDigit = digits[lastDigit];
  const lineNumber = parseInt(firstDigit + lastDigit);
  console.log('lineNumber:', lineNumber);
  sum += lineNumber;
}

console.log('total sum: ', sum);
