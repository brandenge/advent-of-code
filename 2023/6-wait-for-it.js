const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./6-input2.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n').slice(0, -1);

// Part One

const max_times = lines[0].split(/\s+/g).slice(1).map(n => +n);
const record_times = lines[1].split(/\s+/g).slice(1).map(n => +n);
const races = max_times.map((n, i) => [n, record_times[i]]);

function quadraticFormula(a, b, c) {
  const pos = (-b + Math.sqrt((b ** 2) - (4 * a * c))) / (2 * a);
  const neg = (-b - Math.sqrt((b ** 2) - (4 * a * c))) / (2 * a);
  return [pos, neg];
}

const smallest_button_pushes_minus_1 = races.map(([max_time, record_time]) => {
  const [pos, neg] = quadraticFormula(1, -max_time, record_time);
  return Math.floor(neg);
});

const results = smallest_button_pushes_minus_1.map((n, i) => {
  return (max_times[i] + 1) - (2 * (n + 1)) // Add 1 back in
});

const answer = results.reduce((acc, n) => acc * n, 1);
console.log('answer', answer);

// Part Two

// Just read 6-input2.txt, the same code will work
