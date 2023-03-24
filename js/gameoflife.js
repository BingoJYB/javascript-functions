function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(aliveCell => aliveCell[0] === cell[0] && aliveCell[1] === cell[1]);
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
  let right = state.length ? Math.max(...state.map(cell => cell[0])) : 0;
  let top = state.length ? Math.max(...state.map(cell => cell[1])) : 0;
  let left = state.length ? Math.min(...state.map(cell => cell[0])) : 0;
  let bottom = state.length ? Math.min(...state.map(cell => cell[1])) : 0;

  return {
    topRight: [right, top],
    bottomLeft: [left, bottom]
  }
};

const printCells = (state) => {
  let res = "";
  let { topRight: [right, top], bottomLeft: [left, bottom] } = corners(state);

  while (top >= bottom) {
    let tempLeft = left;

    while (tempLeft <= right) {
      res += printCell([tempLeft, top], state);
      res += tempLeft === right ? "" : " ";
      tempLeft++;
    }

    res += "\n";
    top--;
  }

  return res;
};

const getNeighborsOf = ([x, y]) => {
  let shifts = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
  ];

  return shifts.map(shift => [shift[0] + x, shift[1] + y]);
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter(getNeighbor => contains.call(state, getNeighbor));
};

const willBeAlive = (cell, state) => {
  let numOfLivingNeighbors = getLivingNeighbors(cell, state).length;

  return numOfLivingNeighbors === 3 || (numOfLivingNeighbors === 2 && contains.call(state, cell));
};

const calculateNext = (state) => {
  let nextState = [];
  let { topRight: [right, top], bottomLeft: [left, bottom] } = corners(state);

  right++;
  top++;
  left--;
  bottom--;

  while (top >= bottom) {
    let tempLeft = left;

    while (tempLeft <= right) {
      let cell = [tempLeft, top];

      if (willBeAlive(cell, state)) {
        nextState.push(cell);
      }

      tempLeft++;
    }

    top--;
  }

  return nextState;
};

const iterate = (state, iterations) => {
  return Array.from({ length: iterations }).reduce((prev, next) => [...prev, calculateNext(prev.slice(-1)[0])], [state]);
};

const main = (pattern, iterations) => {
  let initState = startPatterns[pattern];
  let states = iterate(initState, iterations);
  states.forEach((state) => console.log(printCells(state)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;