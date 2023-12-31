const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./18-input.txt', 'utf8').trimEnd();
} catch (err) {
  console.error(err);
}

const lines = data.split('\n')

const digs = lines.map(line => {
  let [dir, meters, color] = line.split(' ');
  meters = +meters;
  color = color.slice(1, -1);
  return [dir, meters, color];
});

// Part One

class Tile {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.char = '.';
    this.isDug = false;
    this.color = '';
    this.up;
    this.down;
    this.left;
    this.right;
    this.adjacents = {};
  }

  get [Symbol.toStringTag]() {
    return `${this.row},${this.col}`;
  }

  toString() {
    return `${this.row},${this.col}`;
  }
}

class Tiles {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.digs = digs;
    this.tiles = this.createTiles();
    this.initializeTiles();
  }

  createTiles() {
    const tiles = [];

    for (let row = 0; row < this.rows; row++) {
      tiles.push([]);
      for (let col = 0; col < this.cols; col++) {
        tiles[row].push(new Tile(row, col));
      }
    }
    return tiles;
  }

  initializeTiles() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const adjacents = this.adjacentTiles(row, col);
        this.tiles[row][col].adjacents = adjacents;
        this.tiles[row][col].up = adjacents.up;
        this.tiles[row][col].down = adjacents.down;
        this.tiles[row][col].left = adjacents.left;
        this.tiles[row][col].right = adjacents.right;
      }
    }
  }

  adjacentTiles(row, col) {
    const adjacent = {}
    if (row < 0 || row >= this.tiles.length || col < 0 || col >= this.tiles[row].length) return adjacent;

    if (row > 0) adjacent.up = this.tiles[row - 1][col];
    if (row < this.tiles.length - 1) adjacent.down = this.tiles[row + 1][col];
    if (col > 0) adjacent.left = this.tiles[row][col - 1];
    if (col < this.tiles[row].length - 1) adjacent.right = this.tiles[row][col + 1];

    return adjacent;
  }

  digPerimeter() {
    let current = this.tiles[Math.floor(this.rows / 2)][Math.floor(this.cols / 2)];
    const direction = {
      'U': 'up',
      'D': 'down',
      'L': 'left',
      'R': 'right'
    };

    for (const dig of digs) {
      const [dir, meters, color] = dig;
      for (let i = 0; i < meters; i++) {
        current = current[direction[dir]];
        current.char = '#';
        current.color = color;
      }
    }
  }

  intervals() {
    const result = {};

    for (let row = 0; row < this.rows; row++) {
      let start;
      let end;
      for (let col = 0; col < this.cols; col++) {
        let curr = this.tiles[row][col];
        let prev = curr?.left;
        let next = curr?.right;
        if (prev?.char === '.' && curr?.char === '#') start = curr.col;
        if (curr?.char === '#' && next?.char === '.') end = curr.col;

        if (start && end) {
          if (!result[row]) result[row] = [];
          result[row].push([start, end]);
          start = undefined;
          end = undefined;
        }
      }
    }

    return result;
  }

  isTip(row, col1, col2) {
    if (col1 === col2) return false;
    const start = this.tiles[row][col1];
    const end = this.tiles[row][col2];
    return ((start?.up?.char === '#' && end?.up?.char === '#') ||
            (start?.down?.char === '#' && end?.down?.char === '#'));
  }

  flood() {
    const firstFloodTile = this.firstFloodTile();

    const queue = [firstFloodTile];

    while (queue.length > 0) {
      const current = queue.shift();
      current.char = '#';

      for (const neighbor of Object.values(current.adjacents)) {
        if (neighbor.char === '.') queue.push(neighbor);
      }
    }
  }

  firstFloodTile() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.tiles[row][col].char === '#') {
          return this.tiles[row + 1][col + 1];
        }
      }
    }
  }

  count(char) {
    let counter = 0;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.tiles[row][col].char === char) counter += 1;
      }
    }

    return counter;
  }

  calculateArea() {
    let area = 0;
    const rowIntervals = this.intervals();

    for (const row in rowIntervals) {
      let isInside = false;
      let prevInterval;
      for (const currInterval of rowIntervals[row]) {
        const [currStart, currEnd] = currInterval;
        area += (currEnd - currStart + 1);

        if (isInside) area += (currStart - prevInterval[1] - 1);

        if (!this.isTip(+row, currStart, currEnd)) isInside = !isInside;

        prevInterval = currInterval;
      }
    }

    return area;
  }

  print() {
    for (let row = 0; row < this.rows; row++) {
      console.log(this.tiles[row].map(tile => tile.char).join(''));
    }
  }
}

// Get vertical and horizontal dimensions for total lagoon size
let maxVertical = 0;
let maxHorizontal = 0;
let vertical = 0;
let horizontal = 0;

for (const dig of digs) {
  const [dir, meters, color] = dig;
  switch (dir) {
    case 'U':
      vertical -= meters;
      maxVertical = Math.max(maxVertical, Math.abs(vertical))
      break;
    case 'D':
      vertical += meters;
      maxVertical = Math.max(maxVertical, Math.abs(vertical))
      break;
    case 'L':
      horizontal -= meters;
      maxHorizontal = Math.max(maxHorizontal, Math.abs(horizontal))
      break;
    case 'R':
      horizontal += meters;
      maxHorizontal = Math.max(maxHorizontal, Math.abs(horizontal));
      break;
  }
}

maxVertical += 1;
maxHorizontal += 1;

const tiles = new Tiles(maxVertical * 2 + 2, maxHorizontal * 2 + 2);
tiles.digPerimeter();
const answer1 = tiles.calculateArea();

console.log({answer1});


// Part Two

const digs2 = lines.map(line => {
  const digInstruction = line.split(' ')[2].slice(2, -1);
  const hexMeters = digInstruction.slice(0, -1);
  const direction = digInstruction.at(-1);
  const meters = BigInt(parseInt(hexMeters, 16));

  const directions = {
    '0': 'R',
    '1': 'D',
    '2': 'L',
    '3': 'U'
  };

  const dir = directions[direction];
  return [dir, meters];
});

console.log({digs2});

let x = 0n;
let y = 0n;

let perimeterSum = 0n;
const corners = [];
for (const dig of digs2) {
  const [dir, meters] = dig;

  switch (dir) {
    case 'U': y += meters; break;
    case 'D': y -= meters; break;
    case 'L': x -= meters; break;
    case 'R': x += meters; break;
  }

  corners.push([x, y]);
  perimeterSum += meters;
}

let sumX = 0n;
let sumY = 0n;

for (let i = 0; i < corners.length - 1; i++) {
  const [currX, currY] = corners[i];
  const [nextX, nextY] = corners[i + 1];
  sumX += currX * nextY;
  sumY += currY * nextX;
}

const answer2 = (sumY - sumX + perimeterSum) / 2n + 1n;

console.log({answer2});
