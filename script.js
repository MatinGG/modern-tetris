const rows = 20;
const cols = 10;
const game = document.getElementById("game");
let grid = [];

// ساختن گرید
for (let r = 0; r < rows; r++) {
  grid[r] = [];
  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    game.appendChild(cell);
    grid[r][c] = cell;
  }
}

// شکل‌ها
const SHAPES = [
  [[1, 1, 1], [0, 1, 0]],       // T
  [[1, 1], [1, 1]],             // O
  [[1, 1, 0], [0, 1, 1]],       // S
  [[0, 1, 1], [1, 1, 0]],       // Z
  [[1, 1, 1, 1]],               // I
];

let current = {
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  row: 0,
  col: 3
};

// رسم شکل
function draw() {
  clear();
  current.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val && grid[current.row + r] && grid[current.row + r][current.col + c]) {
        grid[current.row + r][current.col + c].classList.add("active");
      }
    });
  });
}

// پاک‌سازی قبلی‌ها
function clear() {
  grid.flat().forEach(cell => cell.classList.remove("active"));
}

// چک کردن برخورد
function isValid(nextRow, nextCol, shape = current.shape) {
  return shape.every((row, r) =>
    row.every((val, c) => {
      if (!val) return true;
      let x = nextCol + c;
      let y = nextRow + r;
      return y < rows && x >= 0 && x < cols && (!grid[y] || !grid[y][x].classList.contains("fixed"));
    })
  );
}

// ثابت کردن بلوک
function fix() {
  current.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val && grid[current.row + r][current.col + c]) {
        grid[current.row + r][current.col + c].classList.add("fixed");
      }
    });
  });
}

// چک ردیف کامل
function clearLines() {
  for (let r = rows - 1; r >= 0; r--) {
    if (grid[r].every(cell => cell.classList.contains("fixed"))) {
      for (let y = r; y > 0; y--) {
        for (let x = 0; x < cols; x++) {
          grid[y][x].className = grid[y - 1][x].className;
        }
      }
      for (let x = 0; x < cols; x++) {
        grid[0][x].className = "cell";
      }
      r++; // چک دوباره همین ردیف
    }
  }
}

// حرکت به پایین
function moveDown() {
  if (isValid(current.row + 1, current.col)) {
    current.row++;
  } else {
    fix();
    clearLines();
    current = {
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      row: 0,
      col: 3
    };
    if (!isValid(current.row, current.col)) {
      alert("Game Over 😵");
      location.reload();
    }
  }
  draw();
}

// کنترل با کیبورد
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && isValid(current.row, current.col - 1)) current.col--;
  if (e.key === "ArrowRight" && isValid(current.row, current.col + 1)) current.col++;
  if (e.key === "ArrowDown") moveDown();
  if (e.key === "ArrowUp") rotate();
  draw();
});

// چرخش
function rotate() {
  const rotated = current.shape[0].map((_, i) =>
    current.shape.map(row => row[i]).reverse()
  );
  if (isValid(current.row, current.col, rotated)) current.shape = rotated;
}

// تایمر بازی
setInterval(moveDown, 500);
