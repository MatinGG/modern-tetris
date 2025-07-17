const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");

const rows = 20, cols = 10;
const grid = [];
let score = 0;

for (let r = 0; r < rows; r++) {
  const row = [];
  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    game.appendChild(cell);
    row.push(cell);
  }
  grid.push(row);
}

const SHAPES = [
  [[1, 1, 1, 1]],          // I
  [[1, 1], [1, 1]],        // O
  [[0, 1, 0], [1, 1, 1]],  // T
  [[1, 0, 0], [1, 1, 1]],  // J
  [[0, 0, 1], [1, 1, 1]],  // L
  [[1, 1, 0], [0, 1, 1]],  // S
  [[0, 1, 1], [1, 1, 0]]   // Z
];

function randomColor() {
  const r = () => Math.floor(Math.random() * 256);
  return `rgb(${r()},${r()},${r()})`;
}

function createPiece() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return {
    shape,
    row: 0,
    col: Math.floor((cols - shape[0].length) / 2),
    color: randomColor()
  };
}

let current = createPiece();

function draw() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].classList.contains("fixed")) {
        grid[r][c].style.backgroundColor = "#222";
      }
    }
  }

  current.shape.forEach((row, rIdx) => {
    row.forEach((val, cIdx) => {
      if (val) {
        const r = current.row + rIdx;
        const c = current.col + cIdx;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          grid[r][c].style.backgroundColor = current.color;
        }
      }
    });
  });
}

function canMove(offsetRow, offsetCol, testShape = current.shape) {
  for (let r = 0; r < testShape.length; r++) {
    for (let c = 0; c < testShape[r].length; c++) {
      if (testShape[r][c]) {
        const newR = current.row + r + offsetRow;
        const newC = current.col + c + offsetCol;
        if (
          newR >= rows ||
          newC < 0 ||
          newC >= cols ||
          (newR >= 0 && grid[newR][newC].classList.contains("fixed"))
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function freeze() {
  current.shape.forEach((row, rIdx) => {
    row.forEach((val, cIdx) => {
      if (val) {
        const r = current.row + rIdx;
        const c = current.col + cIdx;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          const cell = grid[r][c];
          cell.classList.add("fixed");
          cell.style.backgroundColor = current.color;
        }
      }
    });
  });
}

function clearLines() {
  for (let r = rows - 1; r >= 0; r--) {
    if (grid[r].every(cell => cell.classList.contains("fixed"))) {
      score += 100;
      scoreDisplay.textContent = score;

      grid[r].forEach(cell => cell.classList.add("clearing"));

      setTimeout(() => {
        grid[r].forEach(cell => {
          cell.classList.remove("clearing", "fixed");
          cell.style.backgroundColor = "#222";
        });

        for (let y = r; y > 0; y--) {
          for (let x = 0; x < cols; x++) {
            grid[y][x].className = grid[y - 1][x].className;
            grid[y][x].style.backgroundColor = grid[y - 1][x].style.backgroundColor;
          }
        }

        r++;
      }, 400);
    }
  }
}

function moveDown() {
  if (canMove(1, 0)) {
    current.row++;
  } else {
    freeze();
    clearLines();
    current = createPiece();
    if (!canMove(0, 0)) {
      alert("Game Over\nFinal Score: " + score);
      location.reload();
    }
  }
  draw();
}

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && canMove(0, -1)) {
    current.col--;
  } else if (e.key === "ArrowRight" && canMove(0, 1)) {
    current.col++;
  } else if (e.key === "ArrowDown") {
    moveDown();
  } else if (e.key === "ArrowUp") {
    const rotated = rotate(current.shape);
    if (canMove(0, 0, rotated)) {
      current.shape = rotated;
    }
  }
  draw();
});

setInterval(moveDown, 500);
draw();
