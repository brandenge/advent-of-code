const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./16-input.txt', 'utf8').trimEnd();
} catch (err) {
  console.error(err);
}

const lines = data.split('\n');
const chars = lines.map(line => line.split(''));

// Part One

class Tile {
  constructor(row, col, char) {
    this.row = row;
    this.col = col;
    this.char = char;
    this.beams = [];
    this.up;
    this.down;
    this.left;
    this.right;
    this.adjacents = {};
  }
}

class Tiles {
  constructor(chars) {
    this.chars = chars;
    this.tiles = this.createTiles(chars);
    this.initializeTiles();
  }

  createTiles(chars) {
    const tiles = [];

    for (let row = 0; row < chars.length; row++) {
      tiles.push([]);
      for (let col = 0; col < chars[row].length; col++) {
        tiles[row].push(new Tile(row, col, chars[row][col]));
      }
    }
    return tiles;
  }

  initializeTiles() {
    for (let row = 0; row < chars.length; row++) {
      for (let col = 0; col < chars[row].length; col++) {
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
    if (row < 0 || row >= this.tiles.length || col < 0 || col >= this.tiles[0].length) return adjacent;

    if (row > 0) adjacent.up = this.tiles[row - 1][col];
    if (row < this.tiles.length - 1) adjacent.down = this.tiles[row + 1][col];
    if (col > 0) adjacent.left = this.tiles[row][col - 1];
    if (col < this.tiles[row].length - 1) adjacent.right = this.tiles[row][col + 1];

    return adjacent;
  }

  shootBeam(currentTile, direction = 'right') {
    while(currentTile && !currentTile.beams.includes(direction)) {
      currentTile.beams.push(direction);
      switch(currentTile.char) {
        case '.':
          switch(direction) {
            case 'up':
              currentTile = currentTile.up;
              break;
            case 'down':
              currentTile = currentTile.down;
              break;
            case 'left':
              currentTile = currentTile.left;
              break;
            case 'right':
              currentTile = currentTile.right;
              break;
          }
          break;
        case '|':
          switch(direction) {
            case 'up':
              currentTile = currentTile.up;
              break;
            case 'down':
              currentTile = currentTile.down;
              break;
            case 'left':
              this.shootBeam(currentTile.down, 'down');
              currentTile = currentTile.up;
              direction = 'up';
              break;
            case 'right':
              this.shootBeam(currentTile.down, 'down');
              currentTile = currentTile.up;
              direction = 'up';
              break;
          }
          break;
        case '-':
          switch(direction) {
            case 'up':
              this.shootBeam(currentTile.right, 'right');
              currentTile = currentTile.left;
              direction = 'left';
              break;
            case 'down':
              this.shootBeam(currentTile.right, 'right');
              currentTile = currentTile.left;
              direction = 'left';
              break;
            case 'left':
              currentTile = currentTile.left;
              break;
            case 'right':
              currentTile = currentTile.right;
              break;
          }
          break;
        case '/':
          switch(direction) {
            case 'up':
              currentTile = currentTile.right;
              direction = 'right';
              break;
            case 'down':
              currentTile = currentTile.left;
              direction = 'left';
              break;
            case 'left':
              currentTile = currentTile.down;
              direction = 'down';
              break;
            case 'right':
              currentTile = currentTile.up;
              direction = 'up';
              break;
          }
          break;
        case '\\':
          switch(direction) {
            case 'up':
              currentTile = currentTile.left;
              direction = 'left';
              break;
            case 'down':
              currentTile = currentTile.right;
              direction = 'right';
              break;
            case 'left':
              currentTile = currentTile.up;
              direction = 'up';
              break;
            case 'right':
              currentTile = currentTile.down;
              direction = 'down';
              break;
          }
          break;
      }
    }
  }

  countEnergizedTiles() {
    let count = 0;

    for (let row = 0; row < chars.length; row++) {
      for (let col = 0; col < chars[row].length; col++) {
        if (this.tiles[row][col].beams.length > 0) count += 1;
      }
    }

    return count;
  }

  clearBeams() {
    for (let row = 0; row < chars.length; row++) {
      for (let col = 0; col < chars[row].length; col++) {
        this.tiles[row][col].beams = [];
      }
    }
  }

  findMaxEnergized() {
    const energized = [];

    // Top Edge
    for (let col = 0; col < this.tiles[0].length; col++) {
      this.shootBeam(this.tiles[0][col], 'down');
      energized.push(this.countEnergizedTiles());
      this.clearBeams();
    }

    // Bottom Edge
    for (let col = 0; col < this.tiles[0].length; col++) {
      this.shootBeam(this.tiles[this.tiles.length - 1][col], 'up');
      energized.push(this.countEnergizedTiles());
      this.clearBeams();
    }

    // Left Edge
    for (let row = 0; row < this.tiles.length; row++) {
      this.shootBeam(this.tiles[row][0], 'right');
      energized.push(this.countEnergizedTiles());
      this.clearBeams();
    }

    // Right Edge
    for (let row = 0; row < this.tiles.length; row++) {
      this.shootBeam(this.tiles[row][this.tiles[row].length - 1], 'left');
      energized.push(this.countEnergizedTiles());
      this.clearBeams();
    }

    return Math.max(...energized);
  }
}

const tiles = new Tiles(chars);
tiles.shootBeam(tiles.tiles[0][0]);

const answer1 = tiles.countEnergizedTiles();
console.log({answer1});

// Part Two
const answer2 = tiles.findMaxEnergized();
console.log({answer2});
