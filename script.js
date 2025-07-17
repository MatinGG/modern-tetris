const rows = 20;
const cols = 10;
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
let score = 0;

// ساختن گرید بازی
const grid = [];
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

// شکل‌های تترس
const shapes = [
  [[1, 1, 1, 1]],                  // I
  [[1, 1], [1, 1]],                // O
  [[0, 1, 0], [1, 1, 1]],          // T
  [[1, 0, 0], [1, 1, 1]],          // L
  [[0, 0, 1], [1, 1, 1]],          // J
  [[1, 1, 0], [0, 1, 1]],          // S
  [[0, 1, 1], [1, 1, 0]],          // Z
];

// تابع ساخت رنگ RGB تصادفی
function randomColor() {
  const r = Math.floor(Math.random() * 155 + 100);
  const g = Math.floor(Math.random() * 155 + 100);
  const b = Math.floor(Math.random() * 155 + 100);
  return `rgb(${r}, ${g}, ${b})`;
}

// وضعیت فعلی قطعه
let current = {
  shape: null,
  row: 0,
  col: 0,
  color: "#fff"
};

function draw() {
  // پاک‌سازی گرید
  grid.forEach(row => row.forEach(cell => {
    if (!cell.classList.contains("fixed")) {
      cell.style.backgroundColor = "#222";
    }
  }));

  // کشیدن قطعه
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

  // امتیاز به ازای گذاشتن قطعه
  score += 100;
  scoreDisplay.textContent = score;
}

function isValid(rowOffset = 0, colOffset = 0, shape = current.shape) {
  return shape.every((row, rIdx) =>
    row.every((val, cIdx) => {
      if (!val) return true;
      const r = current.row + rIdx + rowOffset;
      const c = current.col + cIdx + colOffset;
      return r >= 0 && r < rows && c >= 0 && c < cols &&
        !grid[r][c].classList.contains("fixed");
    })
  );
}

function rotate() {
  const rotated = current.shape[0].map((_, i) =>
    current.shape.map(row => row[i]).reverse()
  );
  if (isValid(0, 0, rotated)) {
    current.shape = rotated;
  }
}

function clearLines() {
  for (let r = rows - 1; r >= 0; r--) {
    if (grid[r].every(cell => cell.classList.contains("fixed"))) {
      // انیمیشن قبل از حذف
      grid[r].forEach(cell => cell.classList.add("clearing"));

      setTimeout(() => {
        // امتیاز حذف خط
        score += 500;
        scoreDisplay.textContent = score;

        // پاک کردن لاین
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

function spawnPiece() {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = randomColor();
  current = {
    shape,
    row: 0,
    col: Math.floor((cols - shape[0].length) / 2),
    color
  };

  if (!isValid()) {
    alert("Game Over! Your score: " + score);
    location.reload();
  }
}

function tick() {
  if (isValid(1, 0)) {
    current.row++;
  } else {
    freeze();
    clearLines();
    spawnPiece();
  }
  draw();
}

setInterval(tick, 500);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && isValid(0, -
