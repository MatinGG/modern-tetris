const rows = 20;
const cols = 10;
const game = document.getElementById("game");
let grid = [];
for (let r = 0; r < rows; r++) {
  grid[r] = [];
  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    game.appendChild(cell);
    grid[r][c] = cell;
  }
}
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
