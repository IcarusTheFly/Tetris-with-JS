document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const ScoreDisplay = document.querySelector('#score');
  const StartBtn = document.querySelector('#start-button');
  const width = 10;

  // Tetrominoes!
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],

    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  // TO-DO: Create rotations for the other tetrominoes
  const zTetromino = lTetromino,
    tTetromino = lTetromino,
    oTetromino = lTetromino,
    iTetromino = lTetromino;

  const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4,
    currentRotation = 0;

  // Randomly select a tetromino
  let random = Math.floor(Math.random() * tetrominoes.length);
  // let randomRotation = Math.floor(Math.random() * 3); // For testing
  console.log(random);
  let current = tetrominoes[random][0];

  // Draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
    })
  }

  // Undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
    })
  }

  // Move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));

      // Starts a new tetromino falling
      random = Math.floor(Math.random() * tetrominoes.length);
      current = tetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
    }
  }

  // MAIN PROCESS
  draw();

  // Make the tetromino move down every second
  timerId = setInterval(moveDown, 1000);




  // LOGS
  console.log(squares);
  console.log(tetrominoes);
});
