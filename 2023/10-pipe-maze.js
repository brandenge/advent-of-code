const { count } = require('console');
const exp = require('constants');
const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./10-input.txt', 'utf8');
} catch (err) {
  console.error(err);
}

const lines = data.split('\n').slice(0, -1);
const chars = lines.map(line => line.split(''));

// Part One

class Tile {
  constructor(row, col, chars) {
    this.row = row;
    this.col = col;
    this.char = chars[row][col];
    this.adjacentTiles = {}
    this.up = undefined;
    this.down = undefined;
    this.left = undefined;
    this.right = undefined;

    this.isLoopTile = false;
    this.isClockwise = false;
  }
}

class Tiles {
  constructor(chars) {
    this.chars = chars;
    this.initialize(chars);
  }

  initialize(chars) {
    this.chars = chars;
    this.tiles = this.createTiles();
    this.startTile = this.getStartTile();
    this.loopTiles = [];
    this.nonLoopTiles = [];
    this.enclosedTiles = [];
    this.initializeTiles();
  }

  createTiles() {
    return this.iterateTiles((row, col) => new Tile(row, col, this.chars))
  }

  initializeTiles() {
    this.initializeAdjacentTiles();
    this.initializeLoopTiles();
  }

  getStartTile() {
    return this.filterTiles((row, col) => this.tiles[row][col].char === 'S')[0];
  }

  initializeAdjacentTiles() {
    this.iterateTiles((row, col) => {
      const tile = this.tiles[row][col]
      tile.adjacentTiles = this.adjacentTiles(tile);
    });
  }

  initializeLoopTiles() {
    let prev = this.startTile;
    const startChar = this.getStartChar(prev);
    this.loopTiles.push(prev);
    let current;

    if ('|LJ'.includes(startChar)) current = prev.up;
    else if ('-F'.includes(startChar)) current = prev.right;
    else current = prev.left;

    if ([prev.up, prev.right].includes(current)) current.isClockwise = true;

    while (!this.loopTiles.includes(current)) {
      this.loopTiles.push(current);
      current.isLoopTile = true;
      if (current.char === '|') {
        current.isClockwise = true;
        if (prev === current.down) {
          [prev, current] = [current, current.up];
        } else {
          [prev, current] = [current, current.down];
        }
      } else if (current.char === '-') {
        current.isClockwise = true;
        if (prev === current.left) {
          [prev, current] = [current, current.right];
        } else {
          [prev, current] = [current, current.left];
        }
      } else if (current.char === 'J') {
        if (prev === current.up) {
          current.isClockwise = true;
          [prev, current] = [current, current.left];
        } else {
          [prev, current] = [current, current.up];
        }
      } else if (current.char === 'L') {
        if (prev === current.right) {
          current.isClockwise = true;
          [prev, current] = [current, current.up];
        } else {
          [prev, current] = [current, current.right];
        }
      } else if (current.char === '7') {
        if (prev === current.left) {
          current.isClockwise = true;
          [prev, current] = [current, current.down];
        } else {
          [prev, current] = [current, current.left];
        }
      } else if (current.char === 'F') {
        if (prev === current.down) {
          current.isClockwise = true;
          [prev, current] = [current, current.right];
        } else {
          [prev, current] = [current, current.down];
        }
      }
    }
    this.nonLoopTiles = this.filterTiles((row, col) => {
      return this.loopTiles.includes(this.tiles[row][col]);
    });
  }

  iterateTiles(callback, tiles = []) {
    for (let row = 0; row < this.chars.length; row++) {
      tiles.push([]);
      for (let col = 0; col < this.chars[0].length; col++) {
        tiles[row].push(callback(row, col));
      }
    }
    return tiles;
  }

  filterTiles(callback, tiles = []) {
    for (let row = 0; row < this.chars.length; row++) {
      for (let col = 0; col < this.chars[0].length; col++) {
        if (callback(row, col)) tiles.push(this.tiles[row][col]);
      }
    }
    return tiles;
  }

  adjacentTiles(tile) {
    const [row, col] = [tile.row, tile.col];
    const adjTiles = {};

    if (this.tiles[row - 1]) adjTiles.up         = this.tiles[row - 1][col];
    if (this.tiles[row + 1]) adjTiles.down       = this.tiles[row + 1][col];
    if (this.tiles[row][col - 1]) adjTiles.left  = this.tiles[row][col - 1];
    if (this.tiles[row][col + 1]) adjTiles.right = this.tiles[row][col + 1];

    tile.up    = adjTiles.up;
    tile.down  = adjTiles.down;
    tile.left  = adjTiles.left;
    tile.right = adjTiles.right;

    return tile.adjacentTiles = adjTiles;
  }

  getStartChar(startTile) {
    startTile.isClockwise = true;
    startTile.isLoopTile = true;

    const adjTiles = this.adjacentTiles(startTile);
    const connected = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    if ('|7F'.includes(adjTiles?.up?.char))    connected.up    = true;
    if ('|JL'.includes(adjTiles?.down?.char))  connected.down  = true;
    if ('-FL'.includes(adjTiles?.left?.char))  connected.left  = true;
    if ('-7J'.includes(adjTiles?.right?.char)) connected.right = true;

    if      (connected.up   && connected.down)  return '|';
    else if (connected.left && connected.right) return '-';
    else if (connected.up   && connected.left)  return 'J';
    else if (connected.up   && connected.right) return 'L';
    else if (connected.down && connected.left)  return '7';
    else if (connected.down && connected.right) return 'F';
  }

  printTiles() {
    for (const row of this.tiles) {
      console.log(row.map((tile => tile.char)).join(''));
    }
  }

  clearTiles() {
    this.iterateTiles((row, col) => {
      const tile = this.tiles[row][col];
      if (!this.loopTiles.includes(tile)) tile.char = '.';
    });
  }

  flood(tile) {
    if (tile.char === 'O' || tile.isLoopTile) return;
    tile.char = 'O';
    for (const adjTile of Object.values(tile.adjacentTiles)) {
      this.flood(adjTile);
    }
  }

  floodOutside() {
    let borderTiles = this.tiles[0].slice();
    for (let i = 1; i < this.tiles.length - 1; i++) {
      borderTiles.push(this.tiles[i][0], this.tiles[i][this.tiles[i].length - 1]);
    }
    borderTiles = borderTiles.concat(this.tiles[this.tiles.length - 1]);

    for (const tile of borderTiles) {
      this.flood(tile);
    }
  }

  floodInnerOutside() {
    const innerOutsideTiles = this.filterTiles((row, col) => {
      const char = this.tiles[row][col];
      let isInnerOutsideTile = false;
      for (const adjTile of Object.values(char.adjacentTiles)) {
        if (adjTile.isLoopTile && !adjTile.isClockwise) {
          isInnerOutsideTile = true;
        }
      }
      return isInnerOutsideTile;
    });

    for (const tile of innerOutsideTiles) {
      this.flood(tile);
    }
  }

  initializeEnclosedTiles() {
    this.clearTiles();
    this.floodOutside();
    this.floodInnerOutside();

    const enclosedTiles = this.filterTiles((row, col) => {
      const char = this.tiles[row][col];
      return char.char === '.';
    });

    for (const enclosedTile of enclosedTiles) {
      enclosedTile.char = 'I';
    }
  }

  initializeExpandedEnclosedTiles() {
    this.floodOutside();

    const enclosedTiles = this.filterTiles((row, col) => {
      const char = this.tiles[row][col];
      return char.char === '.';
    });

    for (const enclosedTile of enclosedTiles) {
      enclosedTile.char = 'I';
    }
  }

  expandedChars() {
    this.clearTiles();
    const expChars = []

    for (let row = 0; row < this.chars.length; row++) {
      expChars.push([], []);
      for (let col = 0; col < this.chars[0].length; col++) {
        let char = this.tiles[row][col].char;
        const isStartChar = char === 'S';
        if (isStartChar) char = this.getStartChar(this.tiles[row][col]);
        if (char === '.') {
          expChars[row * 2][col * 2] = '.';
          expChars[row * 2 + 1][col * 2] = '.';
          expChars[row * 2][col * 2 + 1] = '.';
          expChars[row * 2 + 1][col * 2 + 1] = '.';
        } else if (char === '-') {
          expChars[row * 2][col * 2] = '-';
          expChars[row * 2 + 1][col * 2] = '.';
          expChars[row * 2][col * 2 + 1] = '-';
          expChars[row * 2 + 1][col * 2 + 1] = '.';
        } else if (char === '|') {
          expChars[row * 2][col * 2] = '|';
          expChars[row * 2 + 1][col * 2] = '|';
          expChars[row * 2][col * 2 + 1] = '.';
          expChars[row * 2 + 1][col * 2 + 1] = '.';
        } else if (char === 'J') {
          expChars[row * 2][col * 2] = 'J';
          expChars[row * 2 + 1][col * 2] = '.';
          expChars[row * 2][col * 2 + 1] = '.';
          expChars[row * 2 + 1][col * 2 + 1] = '.';
        } else if (char === 'L') {
          expChars[row * 2][col * 2] = 'L';
          expChars[row * 2 + 1][col * 2] = '.';
          expChars[row * 2][col * 2 + 1] = '-';
          expChars[row * 2 + 1][col * 2 + 1] = '.';
        } else if (char === '7') {
          expChars[row * 2][col * 2] = '7';
          expChars[row * 2 + 1][col * 2] = '|';
          expChars[row * 2][col * 2 + 1] = '.';
          expChars[row * 2 + 1][col * 2 + 1] = '.';
        } else if (char === 'F') {
          expChars[row * 2][col * 2] = 'F';
          expChars[row * 2 + 1][col * 2] = '|';
          expChars[row * 2][col * 2 + 1] = '-';
          expChars[row * 2 + 1][col * 2 + 1] = '.';
        } else if (char === 'J') {
          expChars[row * 2][col * 2] = 'J';
          expChars[row * 2 + 1][col * 2] = '.';
          expChars[row * 2][col * 2 + 1] = '.';
          expChars[row * 2 + 1][col * 2 + 1] = '.';
        }
        if (isStartChar) expChars[row * 2][col * 2] = 'S';
        if (col === this.chars[row].length - 1) {
          expChars[row * 2].pop();
          expChars[row * 2 + 1].pop();
        }
      }
      if (row === this.chars.length - 1) expChars.pop();
    }
    this.initialize(expChars)
    this.initializeExpandedEnclosedTiles();
  }
}

const tiles = new Tiles(chars);

const answer1 = Math.ceil(tiles.loopTiles.length / 2);
console.log({answer1});

// Part Two

// Approach #1 - Flood from the outside then flood from each counterclockwise loop tile
tiles.initializeEnclosedTiles();
const enclosedTiles = tiles.filterTiles((row, col) => {
  return tiles.tiles[row][col].char === 'I';
});
const answer2 = enclosedTiles.length;
console.log({answer2});

// Approach #2 - Expand and then flood once from the outside
tiles.expandedChars();
const enclosedTiles2 = tiles.filterTiles((row, col) => {
  return tiles.tiles[row][col].char === 'I' && row % 2 === 0 && col % 2 === 0;
});
const answer2b = enclosedTiles2.length;
console.log({answer2b});
