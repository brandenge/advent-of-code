const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./2-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const games = data.split('\n');

// Part One
let sum = 0;

games.forEach((game, i) => {
  const gameSets = game.split(/[:;]/).slice(1);
  let isPossible = true;
  gameSets.forEach(set => {
    setColors = set.split(',');
    for (color of setColors) {
      if (!isPossible) break;
      const cubeCount = parseInt(color.match(/\d+/));
      if ((color.includes('red') && cubeCount > 12) ||
          (color.includes('green') && cubeCount > 13) ||
          (color.includes('blue') && cubeCount > 14)) {
        isPossible = false;
        break;
      }
    }
  });
  if (isPossible) sum = sum + i + 1;
});

sum -= 101; // Offset last line (which is blank) from being counted
// console.log('sum:', sum);

// Part Two
let powerSum = 0;

games.forEach((game, i) => {
  const game_sets = game.split(/[:;]/).slice(1);
  let minRed = 0;
  let minGreen = 0;
  let minBlue = 0;
  game_sets.forEach(set => {
    set_colors = set.split(',');
    for (color of set_colors) {
      const cubeCount = parseInt(color.match(/\d+/));
      if (color.includes('red') && cubeCount > minRed) {
        minRed = cubeCount;
      } else if (color.includes('green') && cubeCount > minGreen) {
        minGreen = cubeCount;
      } else if (color.includes('blue') && cubeCount > minBlue) {
        minBlue = cubeCount;
      }
    }
  });
  powerSum += (minRed * minGreen * minBlue);
});

console.log('powerSum:', powerSum);
