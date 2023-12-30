const fs = require('fs');

let data;
try {
  data = fs.readFileSync('./17-input.txt', 'utf8').trimEnd();
} catch (err) {
  console.error(err);
}

const lines = data.split('\n')
const chars = lines.map(line => line.split(''));

// Part One

class Tile {
  constructor(row, col, weight) {
    this.row = row;
    this.col = col;
    this.weight = weight;
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
  constructor(chars) {
    this.chars = chars;
    this.tiles = this.createTiles(chars);
    this.initializeTiles();
    this.startTile = this.tiles[0][0];
    this.endTile = this.tiles[this.tiles.length - 1][this.tiles[this.tiles.length - 1].length - 1];
  }

  createTiles(chars) {
    const tiles = [];

    for (let row = 0; row < chars.length; row++) {
      tiles.push([]);
      for (let col = 0; col < chars[row].length; col++) {
        tiles[row].push(new Tile(row, col, +chars[row][col]));
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
    if (row < 0 || row >= this.tiles.length || col < 0 || col >= this.tiles[row].length) return adjacent;

    if (row > 0) adjacent.up = this.tiles[row - 1][col];
    if (row < this.tiles.length - 1) adjacent.down = this.tiles[row + 1][col];
    if (col > 0) adjacent.left = this.tiles[row][col - 1];
    if (col < this.tiles[row].length - 1) adjacent.right = this.tiles[row][col + 1];

    return adjacent;
  }

  dijkstras1() {
    const minHeapQueue = new MinHeapQueue();
    minHeapQueue.enqueue(this.startTile, 0, '', 0);

    const costSoFar = {};
    costSoFar[`${this.startTile}:0:h`] = 0;

    while (!minHeapQueue.isEmpty()) {
      const root = minHeapQueue.dequeue();
      const priority = root.priority;
      const current = root.element;
      const direction = root.direction;
      let directionCount = root.directionCount;

      // Remove backward direction
      let directions;
      switch (direction) {
        case 'up': directions = ['up', 'left', 'right']; break;
        case 'down': directions = ['down', 'left', 'right']; break;
        case 'left': directions = ['up', 'down', 'left']; break;
        case 'right': directions = ['up', 'down', 'right']; break;
        default: directions = ['right', 'down'];
      }

      for (const dir of directions) {
        if (!current[dir] || (direction === dir && directionCount >= 3)) continue;
        let newDirectionCount = 1;
        if (direction === dir) newDirectionCount = directionCount + 1;

        const vOrH = dir === 'up' || dir === 'down' ? 'v' : 'h';
        const next = current[dir];
        const newCost = priority + next.weight;

        if (!costSoFar[`${next}:${newDirectionCount}:${vOrH}`] ||
        newCost < costSoFar[`${next}:${newDirectionCount}:${vOrH}`]) {
          costSoFar[`${next}:${newDirectionCount}:${vOrH}`] = newCost;
          minHeapQueue.enqueue(next, newCost, dir, newDirectionCount);
        }
      }
    }

    return [
      costSoFar[`${this.endTile}:1:v`],
      costSoFar[`${this.endTile}:1:h`],
      costSoFar[`${this.endTile}:2:v`],
      costSoFar[`${this.endTile}:2:h`],
      costSoFar[`${this.endTile}:3:v`],
      costSoFar[`${this.endTile}:3:h`]
    ];
  }

  // Part Two

  dijkstras2() {
    const minHeapQueue = new MinHeapQueue();
    minHeapQueue.enqueue(this.startTile, 0, '', 0);

    const costSoFar = {};
    costSoFar[`${this.startTile}:0:h`] = 0;

    while (!minHeapQueue.isEmpty()) {
      const root = minHeapQueue.dequeue();
      const priority = root.priority;
      const current = root.element;
      const direction = root.direction;
      let directionCount = root.directionCount;

      // Remove backward direction
      let directions;
      switch (direction) {
        case 'up': directions = ['up', 'left', 'right']; break;
        case 'down': directions = ['down', 'left', 'right']; break;
        case 'left': directions = ['up', 'down', 'left']; break;
        case 'right': directions = ['up', 'down', 'right']; break;
        default: directions = ['right', 'down'];
      }

      for (const dir of directions) {
        if (!current[dir] || (direction === dir && directionCount >= 10)) continue;

        let next = current[dir];
        let weight = next.weight;
        let newDirectionCount;

        if (direction === dir && directionCount >= 4) {
          newDirectionCount = directionCount + 1;
        } else {
          newDirectionCount = 4;
          for (let i = 0; i < 3; i++) {
            next = next[dir];
            if (!next) break;
            weight += next.weight;
          }
        }

        if (!next) continue;
        const vOrH = dir === 'up' || dir === 'down' ? 'v' : 'h';
        const newCost = priority + weight;

        if (!costSoFar[`${next}:${newDirectionCount}:${vOrH}`] ||
        newCost < costSoFar[`${next}:${newDirectionCount}:${vOrH}`]) {
          costSoFar[`${next}:${newDirectionCount}:${vOrH}`] = newCost;
          minHeapQueue.enqueue(next, newCost, dir, newDirectionCount);
        }
      }
    }

    return [
      costSoFar[`${this.endTile}:4:v`],
      costSoFar[`${this.endTile}:4:h`],
      costSoFar[`${this.endTile}:5:v`],
      costSoFar[`${this.endTile}:5:h`],
      costSoFar[`${this.endTile}:6:v`],
      costSoFar[`${this.endTile}:6:h`],
      costSoFar[`${this.endTile}:7:v`],
      costSoFar[`${this.endTile}:7:h`],
      costSoFar[`${this.endTile}:8:v`],
      costSoFar[`${this.endTile}:8:h`],
      costSoFar[`${this.endTile}:9:v`],
      costSoFar[`${this.endTile}:9:h`],
      costSoFar[`${this.endTile}:10:v`],
      costSoFar[`${this.endTile}:10:h`],
    ];
  }

  aStar() {

  }
}

class QueueElement {
  constructor(element, priority, direction = 'right', directionCount = 0) {
    this.element = element;
    this.priority = priority;
    this.direction = direction;
    this.directionCount = directionCount
  }

  toString() {
    return `${this.element.toString()}::${this.priority}`;
  }
}

class MinHeapQueue {
  constructor() {
    this.heap = [];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  front() {
    return this.heap[0];
  }

  rear() {
    return this.heap[this.heap.length - 1];
  }

  print() {
    console.log('QUEUE:', this.heap.map(QueueElement => `${QueueElement.toString()}:${QueueElement.directionCount}`).join(' '));
  }

  enqueue(element, priority, direction, directionCount) {
    const newItem = new QueueElement(element, priority, direction, directionCount);

    this.heap.push(newItem);
    let newNodeIndex = this.heap.length - 1;

    while (newNodeIndex > 0 &&
      this.heap[newNodeIndex].priority <
      this.heap[this.parentIndex(newNodeIndex)].priority) {
      [this.heap[this.parentIndex(newNodeIndex)], this.heap[newNodeIndex]] = [this.heap[newNodeIndex], this.heap[this.parentIndex(newNodeIndex)]];
      newNodeIndex = this.parentIndex(newNodeIndex);
    }
  }

  dequeue() {
    if (this.isEmpty()) return;

    const root = this.front();
    const lastElement = this.heap.pop();
    if (root === lastElement) return root;
    this.heap[0] = lastElement;

    let trickleNodeIndex = 0;

    while (this.hasGreaterChild(trickleNodeIndex)) {
      const largerChildIndex = this.calculateLargerChildIndex(trickleNodeIndex);
      [this.heap[trickleNodeIndex], this.heap[largerChildIndex]] =
      [this.heap[largerChildIndex], this.heap[trickleNodeIndex]];
      trickleNodeIndex = largerChildIndex;
    }

    return root;
  }

  leftChildIndex(index) {
    return index * 2 + 1;
  }

  rightChildIndex(index) {
    return index * 2 + 2;
  }

  parentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  hasGreaterChild(index) {
    return (
      this.heap[this.leftChildIndex(index)] &&
      this.heap[this.leftChildIndex(index)].priority >
      this.heap[index].priority ||
      this.heap[this.rightChildIndex(index)] &&
      this.heap[this.rightChildIndex(index)].priority >
      this.heap[index].priority
    );
  }

  calculateLargerChildIndex(index) {
    if (!this.heap[this.rightChildIndex(index)]) {
      return this.leftChildIndex(index);
    }

    if (this.heap[this.rightChildIndex(index)].priority >
        this.heap[this.leftChildIndex(index)].priority) {
      return this.rightChildIndex(index);
    } else {
      return this.leftChildIndex(index);
    }
  }
}

const tiles = new Tiles(chars);

// About a 30 minute runtime
// const result1 = tiles.dijkstras1();
// const answer1 = Math.min(...result1.filter(n => n));
// console.log({answer1});

// About a 6 hour runtime
const result2 = tiles.dijkstras2();
console.log({result2});
const answer2 = Math.min(...result2.filter(n => n));
console.log({answer2});
