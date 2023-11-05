class Hex {
  constructor(q, r, size) {
    this.q = q;
    this.r = r;
    this.s = -q - r;
    this.size = size;
    this.letter;
    this.number = this.generateNum();
  }

  generateNum() {
    return Math.floor(Math.random() * maxNum) + minNum;
  }
}

for (let i = 0; i < grid.length; i++) {
  grid[i] = new Array(2 * n - 1).fill(undefined);
}

// Generate Hex Grid
for (let i = 0; i < n; i++) {
  for (let j = n - i - 1; j < 2 * n - 1; j++) {
    grid[i][j] = new Hex(j, i, size);
  }
}

for (let i = n; i < 2 * n - 1; i++) {
  for (let j = 0; j < 3 * n - 2 - i; j++) {
    grid[i][j] = new Hex(j, i, size);
  }
}

let count = 0;
var GAME_STATE = false;
var VALID_LETTERS = [];

for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] instanceof Hex) {
      let hex = grid[i][j];
      let width = document.getElementById("grid-container").offsetWidth;
      let height = document.getElementById("grid-container").offsetHeight;

      let filterGrid = grid[i].filter((e) => e != undefined);
      let gridLength = filterGrid.length;
      let sub_q =
        (gridLength % 2 == 0 ? -0.5 : 0) +
        filterGrid[Math.floor(gridLength / 2)].q;
      let sub_r = (n % 2 == 0 ? 0 : 1) + Math.floor(n / 2) - 1;

      let letter = String.fromCharCode(65 + count);
      hex.letter = letter;
      VALID_LETTERS.push(letter);

      document.getElementById("grid-container").innerHTML += `
            <div class="hexagon text-3xl font-bold" style="top:${
              height / 2 + (((i - Math.floor(n / 2) - sub_r) * size) / 4) * 3
            }px;left:${
        width / 2 + (j - sub_q) * size
      }px;transform:translate(-50%, -50%)" data-s="${hex.s}" data-q="${
        hex.q
      }" data-r="${hex.r}">${letter}</div>`;
      count += 1;
    }
  }
}

let timerId;
let TARGET = 0;

function startTimer(duration, type, callback = undefined) {
  let timerElement = document.getElementById("timerTime");
  let timerType = document.getElementById("timerType");
  timerType.innerText = type;
  let startTime = Date.now();
  const updateTimer = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const remaining = duration - elapsed;

    if (remaining >= 0) {
      timerElement.textContent = `${Math.ceil(remaining / 1000)}`;
      timerId = setTimeout(updateTimer, 1000);
    } else {
      if (callback) {
        callback();
      }
    }
  };

  updateTimer();
}

function stopTimer() {
  clearTimeout(timerId);
}

document.getElementById("startBtn").addEventListener("click", (e) => {
  // Generate Numbers for grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] instanceof Hex) {
        grid[i][j].number = grid[i][j].generateNum();
      }
    }
  }

  TARGET = 0;

  document.getElementById("target").innerText = TARGET;
  console.log(memoTime);
  if (document.getElementById("startBtn").dataset.timer == "false") {
    document.getElementById("startBtn").dataset.timer = "true";
    document.getElementById("startBtn").textContent = "Started";
    if (resetScore) {
      points = 0;
    }
    document.getElementById("currentScore").innerText = points;
    document.getElementById("bestScore").innerText = bestScore;
    resetScore = true;
    showNumbers();
    startTimer(memoTime * 1000, "Memory", startRound);
  }
});

function startRound() {
  GAME_STATE = true;
  // Use Permutation to find
  VALID_PERMUTATION = findPermutation();

  // Generate Target
  TARGET = generateTarget(VALID_PERMUTATION);
  hideNumbers();
  document.getElementById("target").innerText = TARGET;
  stopTimer();
  startTimer(roundTime * 1000, "Round", resetBtn);
}

function generateTarget(VALID_PERMUTATION) {
  let possible = [...Object.values(VALID_PERMUTATION)];
  const elementCount = {};
  possible.sort((a, b) => a - b);
  for (const element of possible) {
    if (elementCount[element]) {
      elementCount[element]++;
    } else {
      elementCount[element] = 1;
    }
  }
  let mostFrequentElement = possible[0];
  let highestFrequency = elementCount[possible[0]];
  for (const element in elementCount) {
    if (elementCount[element] > highestFrequency) {
      mostFrequentElement = element;
      highestFrequency = elementCount[element];
    }
  }
  let target = possible[Math.floor(Math.random() * possible.length)];
  target = mostFrequentElement;
  return parseInt(target);
}

function showNumbers() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] instanceof Hex) {
        document.querySelector(
          `.hexagon[data-r='${i}'][data-q='${j}'][data-s='${-i - j}']`
        ).innerText = grid[i][j].number;
      }
    }
  }
}

function hideNumbers() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] instanceof Hex) {
        document.querySelector(
          `.hexagon[data-r='${i}'][data-q='${j}'][data-s='${-i - j}']`
        ).innerText = grid[i][j].letter;
      }
    }
  }
}

let VALID_PERMUTATION = {};

function findPermutation() {
  VALID_PERMUTATION = {};
  let VALID_DIRECTION = ["q", "r", "s"];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] instanceof Hex) {
        currentGrid = grid[i][j];
        grid[i][j].number;
        for (let key of VALID_DIRECTION) {
          if (key == "q") {
            // Straight
            if (
              currentGrid &&
              grid[currentGrid.r][currentGrid.q + 1] &&
              grid[currentGrid.r][currentGrid.q + 2]
            ) {
              let gridCombination = [
                currentGrid,
                grid[currentGrid.r][currentGrid.q + 1],
                grid[currentGrid.r][currentGrid.q + 2],
              ];
              let letterCombination = gridCombination.map((e) => e.letter);
              let numberCombination = gridCombination.map((e) => e.number);
              VALID_PERMUTATION[letterCombination.join("")] =
                numberCombination.reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                );
            }
          } else if (key == "r") {
            // Top Left to Bottom Right
            if (
              currentGrid.r + 2 < grid[0].length &&
              currentGrid &&
              grid[currentGrid.r + 1][currentGrid.q] &&
              grid[currentGrid.r + 2][currentGrid.q]
            ) {
              let gridCombination = [
                currentGrid,
                grid[currentGrid.r + 1][currentGrid.q],
                grid[currentGrid.r + 2][currentGrid.q],
              ];
              let letterCombination = gridCombination.map((e) => e.letter);
              let numberCombination = gridCombination.map((e) => e.number);
              VALID_PERMUTATION[letterCombination.join("")] =
                numberCombination.reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                );
            }
          } else {
            // Bottom Left to Top Right
            if (
              currentGrid.r + 2 < grid[0].length &&
              currentGrid &&
              grid[currentGrid.r + 1][currentGrid.q - 1] &&
              grid[currentGrid.r + 2][currentGrid.q - 2]
            ) {
              let gridCombination = [
                currentGrid,
                grid[currentGrid.r + 1][currentGrid.q - 1],
                grid[currentGrid.r + 2][currentGrid.q - 2],
              ];
              let letterCombination = gridCombination.map((e) => e.letter);
              let numberCombination = gridCombination.map((e) => e.number);
              VALID_PERMUTATION[letterCombination.join("")] =
                numberCombination.reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                );
            }
          }
        }
      }
    }
  }
  return VALID_PERMUTATION;
}

function resetBtn() {
  stopTimer();
  GAME_STATE = false;
  document.getElementById("startBtn").dataset.timer = "false";
  document.getElementById("startBtn").textContent = "Start";
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] instanceof Hex) {
        let rs = window.getComputedStyle(
          document.querySelector(
            `.hexagon[data-r='${i}'][data-q='${j}'][data-s='${-i - j}']`
          )
        );
        document.querySelector(
          `.hexagon[data-r='${i}'][data-q='${j}'][data-s='${-i - j}']`
        ).style.background = rs.getPropertyValue("--border-default");
      }
    }
  }
}

for (let hexagon of document.querySelectorAll(".hexagon")) {
  hexagon.addEventListener("click", () => {
    if (GAME_STATE) {
      addToStack(hexagon.dataset.r, hexagon.dataset.q);
    }
  });
}

document.addEventListener("keydown", (e) => {
  let letterPressed = e.key.toUpperCase();
  if (GAME_STATE) {
    if (VALID_LETTERS.includes(letterPressed)) {
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          if (grid[i][j] instanceof Hex) {
            if (grid[i][j].letter == letterPressed) {
              addToStack(i, j);
            }
          }
        }
      }
    }
  }
});

var stack = [];
var points = 0;

var resetScore = true;

let bestScore = localStorage.getItem("bestScore")
  ? localStorage.getItem("bestScore")
  : 0;
document.getElementById("bestScore").innerText = bestScore;

function addToStack(i, j) {
  let rs = window.getComputedStyle(
    document.querySelector(
      `.hexagon[data-r='${i}'][data-q='${j}'][data-s='${-i - j}']`
    )
  );
  if (stack.length >= 3) return;
  if (stack.includes(grid[i][j])) return;
  document.querySelector(
    `.hexagon[data-r='${i}'][data-q='${j}'][data-s='${-i - j}']`
  ).style.background = rs.getPropertyValue("--border-temp");
  stack.push(grid[i][j]);
  if (stack.length >= 3) {
    let letterCombination = stack.map((e) => e.letter);
    letterCombination.sort();
    if (
      checkStraight() &&
      stack.reduce((accumulator, currentHex) => {
        return accumulator + currentHex.number;
      }, 0) == TARGET &&
      letterCombination.join("") in VALID_PERMUTATION
    ) {
      delete VALID_PERMUTATION[letterCombination.join("")];
      console.log("CORRECT");
      points++;
      if (![...Object.values(VALID_PERMUTATION)].includes(TARGET)) {
        alert(`Round End - All Possible Value of ${TARGET} Found`);
        resetScore = false;
        resetBtn();
      }
    } else {
      console.log("INVALID or NOT TARGET");
      points--;
    }
    document.getElementById("currentScore").innerText = points;
    if (bestScore < points) {
      bestScore = points;
      localStorage.setItem("bestScore", bestScore);
      document.getElementById("bestScore").innerText = bestScore;
    }
    setTimeout(() => {
      for (let hex of stack) {
        document.querySelector(
          `.hexagon[data-r='${hex.r}'][data-q='${hex.q}']`
        ).style.background = rs.getPropertyValue("--border-default");
      }
      for (let hex of document.querySelectorAll(".hexagon")) {
        hex.style.background = rs.getPropertyValue("--border-default");
      }
      stack = [];
    }, 500);
  }
}

function checkStraight() {
  function isSame(arr, key) {
    return arr.every((e) => e[key] === arr[0][key]);
  }

  function isIncreasing(arr, key) {
    return arr.every(
      (e, index) => index === 0 || e[key] === arr[index - 1][key] + 1
    );
  }

  function isSortedAndIncreasing(arr, key1, key2) {
    return arr.sort((a, b) => a[key1] - b[key1]) && isIncreasing(arr, key2);
  }

  if (isSame(stack, "q")) {
    // Top Left to Bottom Right
    return (
      isSortedAndIncreasing(stack, "r", "r") &&
      isSortedAndIncreasing(stack, "s", "s")
    );
  } else if (isSame(stack, "r")) {
    // Straight Line
    return (
      isSortedAndIncreasing(stack, "q", "q") &&
      isSortedAndIncreasing(stack, "s", "s")
    );
  } else if (isSame(stack, "s")) {
    // Bottom Left to Top Right
    return (
      isSortedAndIncreasing(stack, "r", "r") &&
      isSortedAndIncreasing(stack, "q", "q")
    );
  } else {
    return false;
  }
}

document.getElementById("resetScore").addEventListener("click", () => {
  localStorage.removeItem("bestScore");
  bestScore = 0;
  document.getElementById("bestScore").innerText = bestScore;
  points = 0;
  document.getElementById("currentScore").innerText = points;
});
