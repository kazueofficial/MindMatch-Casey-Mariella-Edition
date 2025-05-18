const board = document.getElementById('board');
const turnDisplay = document.getElementById('turn');
const questionBox = document.getElementById('questionBox');
const questionText = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const statusText = document.getElementById('status');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');

let currentPlayer = 'X';
let cells = [];
let selectedCell = null;
let correctAnswer = 0;
let scoreX = 0;
let scoreO = 0;

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.dataset.index = i;
    div.addEventListener('click', () => handleCellClick(div));
    board.appendChild(div);
    cells.push(div);
  }
}

function resetBoard() {
  cells.forEach(cell => {
    cell.innerHTML = '';
    cell.classList.remove('disabled');
  });
  selectedCell = null;
  statusText.textContent = '';
  questionBox.style.display = 'none';
}

function handleCellClick(cell) {
  if (cell.querySelector('img') || selectedCell !== null) return;
  selectedCell = cell;
  generateQuestion();
}

function generateQuestion() {
  // Random inputs 0 or 1
  const A = Math.round(Math.random());
  const B = Math.round(Math.random());
  const C = Math.round(Math.random());

  // Define gates
  const gates = ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'];
  
  // Randomly decide if NOT applies to each input
  function maybeNot(val) {
    return Math.random() < 0.5 ? val : 1 - val;
  }

  // Helper for gate functions
  function applyGate(gate, x, y) {
    switch(gate) {
      case 'AND': return x & y;
      case 'OR': return x | y;
      case 'XOR': return x ^ y;
      case 'NAND': return 1 - (x & y);
      case 'NOR': return 1 - (x | y);
      case 'XNOR': return 1 - (x ^ y);
    }
  }

  // Randomly choose two gates for compound expression
  const gate1 = gates[Math.floor(Math.random() * gates.length)];
  const gate2 = gates[Math.floor(Math.random() * gates.length)];

  // Randomly apply NOT to inputs
  const nA = maybeNot(A);
  const nB = maybeNot(B);
  const nC = maybeNot(C);

  // Calculate intermediate results
  const part1 = applyGate(gate1, nA, nB);
  const result = applyGate(gate2, part1, nC);

  correctAnswer = result;

  // Build question string with NOT shown
  function showVal(orig, val) {
    return val === 1 - orig ? `NOT ${orig}` : orig;
  }

  const q = `What is (${showVal(A, nA)} ${gate1} ${showVal(B, nB)}) ${gate2} ${showVal(C, nC)}? (Answer 0 or 1)`;
  questionText.textContent = q;
  answerInput.value = '';
  questionBox.style.display = 'block';
  answerInput.focus();
}



function submitAnswer() {
  const userAnswer = parseInt(answerInput.value);
  if (isNaN(userAnswer)) {
    alert("Please enter a number.");
    return;
  }

  if (userAnswer === correctAnswer) {
    const img = document.createElement('img');
    img.src = currentPlayer === 'X' ? 'casey.jpg' : 'mariella.jpg';
    img.alt = currentPlayer;
    selectedCell.appendChild(img);
    selectedCell.classList.add('disabled');
    questionBox.style.display = 'none';

    if (checkWinner()) {
      statusText.textContent = `Player ${currentPlayer} wins!`;
      updateScore(currentPlayer);
      setTimeout(resetBoard, 2000);
      return;
    } else if (cells.every(cell => cell.querySelector('img'))) {
      statusText.textContent = "It's a draw!";
      setTimeout(resetBoard, 2000);
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnDisplay.textContent = `Player ${currentPlayer}'s turn`;
  } else {
    alert("Wrong answer! Turn passes.");
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnDisplay.textContent = `Player ${currentPlayer}'s turn`;
  }

  selectedCell = null;
  questionBox.style.display = 'none';
}

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return winPatterns.some(pattern =>
    pattern.every(index => {
      const img = cells[index].querySelector('img');
      return img && img.alt === currentPlayer;
    })
  );
}

function updateScore(player) {
  if (player === 'X') {
    scoreX++;
    scoreXEl.textContent = scoreX;
  } else {
    scoreO++;
    scoreOEl.textContent = scoreO;
  }
}

createBoard();