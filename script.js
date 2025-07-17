const game = document.getElementById("game");

const rows = 20, cols = 10;
const grid = [];
for (let r = 0; r < rows; r++) {
  const row = [];
  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    game.appendChild(cell);
    row.push(cell);
  }
  grid.push(row);
}

const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,0,0],[1,1,1]], // L
  [[0,0,1],[1,1,1]], // J
  [[0,1,1],[1,1,0]], // S
  [[1,1,0],[0,1,1]]  // Z
];

function getRandomColor() {
  const r = Math.floor(Math.random() * 200) + 55;
  const g = Math.floor(Math.random() * 200) + 55;
  const b = Math.floor(Math.random() * 200) + 55;
  return `rgb(${r}, ${g}, ${b})`;
}

let current = {
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  row: 0,
  col: 3,
  color: getRandomColor()
};

function draw() {
  clear();
  current.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        const y = current.row + r;
        const x = current.col + c;
        if (y >= 0 && y < rows && x >= 0 && x < cols) {
          grid[y][x].style.backgroundColor = current.color;
        }
      }
    });
  });
}

function clear() {
  grid.flat().forEach(cell => {
    if (!cell.classList.contains("fixed")) {
      cell.style.backgroundColor = "#222";
    }
  });
}

function fix() {
  current.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        const y = current.row + r;
        const x = current.col + c;
        if (y >= 0 && y < rows && x >= 0 && x < cols) {
          grid[y][x].classList.add("fixed");
          grid[y][x].style.backgroundColor = current.color;
        }
      }
    });
  });
}

function canMove(offsetRow, offsetCol, shape = current.shape) {
  return shape.every((row, r) => {
    return row.every((val, c) => {
      if (!val) return true;
      const y = current.row + r + offsetRow;
      const x = current.col + c + offsetCol;
      return (
        y >= 0 &&
        y < rows &&
        x >= 0 &&
        x < cols &&
        !grid[y][x].classList.contains("fixed")
      );
    });
  });
}

function moveDown() {
  if (canMove(1, 0)) {
    current.row++;
  } else {
    fix();
    clearLines();
    current = {
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      row: 0,
      col: 3,
      color: getRandomColor()
    };
    if (!canMove(0, 0)) {
      alert("Game Over!");
      location.reload();
    }
  }
  draw();
}

function clearLines() {
  for (let r = rows - 1; r >= 0; r--) {
    if (grid[r].every(cell => cell.classList.contains("fixed"))) {
      grid[r].forEach(cell => {
        cell.classList.remove("fixed");
        cell.style.backgroundColor = "#222";
      });
      for (let y = r; y > 0; y--) {
        for (let x = 0; x < cols; x++) {
          grid[y][x].className = grid[y-1][x].className;
          grid[y][x].style.backgroundColor = grid[y-1][x].style.backgroundColor;
        }
      }
      r++;
    }
  }
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
