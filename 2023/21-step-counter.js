const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./21-input.txt', 'utf8').trimEnd();
} catch (err) {
  console.error(err);
}

const inputLines = data.split('\n');
const chars = inputLines.map(line => line.split(''));

// Part One

class Tile {
  constructor(row, col, char) {
    this.row = row;
    this.col = col;
    this.char = char;
    this.isOn = false;
    if (this.char === 'S') this.toggleOn();
    this.up;
    this.down;
    this.left;
    this.right;
    this.adjacents = {};
  }

  get [Symbol.toStringTag]() {
    return `${this.row},${this.col},${this.char},${this.isOn}`;
  }

  toString() {
    return `${this.row},${this.col},${this.char},${this.isOn}`;
  }

  toggleOn() {
    if (this.char === '#') return;
    this.isOn = true;
  }

  toggleOff() {
    if (this.char === '#') return;
    this.isOn = false
  }

  countAdjacentOnTiles() {
    let upCount;
    let downCount;
    let leftCount;
    let rightCount;

    if (this.up.isOn > 0) upCount = this.up.isOn;
    if (this.down.isOn > 0) downCount = this.down.isOn;
    if (this.left.isOn > 0) leftCount = this.left.isOn;
    if (this.right.isOn > 0) rightCount = this.right.isOn;

    const counts = [upCount, downCount, leftCount, rightCount].filter(count => count);
    if (counts.length < 2) return -1;

    return Math.min(...counts);
  }
}

class Tiles {
  constructor(chars) {
    this.chars = chars;
    this.tiles = this.createTiles();
    this.onTiles = [];
    this.initializeTiles();
  }

  createTiles() {
    const tiles = [];

    for (let row = 0; row < this.chars.length; row++) {
      tiles.push([]);
      for (let col = 0; col < this.chars[row].length; col++) {
        tiles[row].push(new Tile(row, col, this.chars[row][col]));
      }
    }
    return tiles;
  }

  initializeTiles() {
    for (let row = 0; row < this.chars.length; row++) {
      for (let col = 0; col < this.chars[row].length; col++) {
        const currentTile = this.tiles[row][col];
        const adjacents = this.adjacentTiles(row, col);
        currentTile.adjacents = adjacents;
        currentTile.up = adjacents.up;
        currentTile.down = adjacents.down;
        currentTile.left = adjacents.left;
        currentTile.right = adjacents.right;

        if (currentTile.char === 'S') {
          this.onTiles.push(currentTile);
        }
      }
    }
  }

  adjacentTiles(row, col) {
    const adjacent = {}
    if (row < 0 || row >= this.tiles.length || col < 0 || col >= this.tiles[row].length) return adjacent;

    if (row === 0) adjacent.up = this.tiles[this.tiles.length - 1][col];
    if (row === this.tiles.length - 1) adjacent.down = this.tiles[0][col];

    if (row > 0) adjacent.up = this.tiles[row - 1][col];
    if (row < this.tiles.length - 1) adjacent.down = this.tiles[row + 1][col];

    if (col === 0) adjacent.left = this.tiles[row][this.tiles[row].length - 1];
    if (col === this.tiles[row].length - 1) adjacent.right = this.tiles[row][0];

    if (col > 0) adjacent.left = this.tiles[row][col - 1];
    if (col < this.tiles[row].length - 1) adjacent.right = this.tiles[row][col + 1];

    return adjacent;
  }

  countOnTiles() {
    let count = 0;

    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 0; col < this.tiles[row].length; col++) {
        const currentTile = this.tiles[row][col];
        if (currentTile.isOn) count += 1;
      }
    }
    return count;
  }

  tileCounts() {
    const tileCounts = {
      evenFull: 0,
      oddFull: 0,
      evenCorner: 0,
      oddCorner: 0,
      evenMiddle: 0,
      oddMiddle: 0,
    };

    this.step(64);
    tileCounts.evenMiddle = this.countCenterTile();
    this.step(1);
    tileCounts.oddMiddle = this.countCenterTile();
    this.step(66);
    tileCounts.oddFull = this.countCenterTile();
    this.step(1);
    tileCounts.evenFull = this.countCenterTile();
    tileCounts.oddCorner = tileCounts.oddFull - tileCounts.oddMiddle;
    tileCounts.evenCorner = tileCounts.evenFull - tileCounts.evenMiddle;

    return tileCounts;
  }

countCenterTile() {
  let count = 0;

    for (let row = 262; row < 393; row++) {
      for (let col = 262; col < 393; col++) {
        const currentTile = this.tiles[row][col];
        if (currentTile.isOn) count += 1;
      }
    }

    return count;
  }

  step(n) {
    for (let step = 0; step < n; step++) {
      const stepOnTiles = [];

      while (this.onTiles.length > 0) {
        const onTile = this.onTiles.shift();
        onTile.toggleOff();

        for (const adjacentTile of Object.values(onTile.adjacents)) {
          if (!stepOnTiles.includes(adjacentTile)) {
            adjacentTile.toggleOn();
            if (adjacentTile.isOn) {
              stepOnTiles.push(adjacentTile);
            }
          }
        }
      }
      this.onTiles = stepOnTiles;
    }
  }

  print() {
    console.log('\n');
    for (let row = 0; row < this.tiles.length; row++) {
      let rowChars = [];
      for (let col = 0; col < this.tiles[row].length; col++) {
        const currentTile = this.tiles[row][col];
        if (currentTile.isOn) rowChars.push('O');
        else rowChars.push(currentTile.char);
      }
      console.log(rowChars.join(''));
    }
    console.log('\n');
  }
}

const tiles = new Tiles(chars);
tiles.step(64);
const answer1 = tiles.countOnTiles();
console.log({answer1});

// Part Two

const inputLines5x = []

for (let i = 0; i < 5; i++) {
  for (const line of inputLines) {
    let newLine = line.replace('S', '.');
    if (i !== 2) {
      inputLines5x.push((newLine + newLine + newLine + newLine + newLine));
    } else {
      inputLines5x.push((newLine + newLine + line + newLine + newLine));
    }
  }
}

const chars5x = inputLines5x.map((line => line.split('')));

const tiles2 = new Tiles(chars5x);
// tiles2.step(65 + 131);
// const result = tiles2.countOnTiles();
// console.log({result});

// This approach using an equation did not work
// It was close, but there must have been a small error somewhere
// const counts = tiles2.tileCounts();
// const cycles = (26501365 - 65) / 131;

// const answer2 = (cycles + 1) ** 2 * counts.oddFull + cycles ** 2 * counts.evenFull - (cycles + 1) * counts.oddCorner + cycles * counts.evenCorner;
// console.log({answer2});


// Using Sequences

function diffs(nums) {
  const result = [];
  for (let i = 0; i < nums.length - 1; i++) {
    let diff = nums[i + 1] - nums[i];
    result.push(diff);
  }
  return result;
}

function nextNum(nums) {
  const sequences = [nums];

  while (nums.some(n => n !== 0n)) {
    nums = diffs(nums);
    sequences.push(nums);
  }

  sequences[sequences.length - 1].push(0n);

  for (let i = sequences.length - 2; i >= 0; i--) {
    sequences[i].push(sequences[i + 1].at(-1) + sequences[i].at(-1));
  }

  return sequences[0].at(-1);
}

let nums = [3802n, 33732n, 93480n];

for (let i = 0; i < 202300 - 2; i++) {
  const next = nextNum(nums);
  nums.shift();
}

const answer2 = nums.at(-1);
console.log({answer2});
