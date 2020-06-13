document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const ScoreDisplay = document.querySelector('#score');
  const StartBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;

  // Tetrominoes definition
  const lTetromino = [
      [1, width + 1, width * 2 + 1, 2],
      [width, width + 1, width + 2, width * 2 + 2],

      [1, width + 1, width * 2 + 1, width * 2],
      [width, width * 2, width * 2 + 1, width * 2 + 2]
    ],
    zTetromino = [
      [width * 2, width + 1, width * 2 + 1, width + 2],
      [0, width, width + 1, width * 2 + 1],
      [width * 2, width + 1, width * 2 + 1, width + 2],
      [0, width, width + 1, width * 2 + 1]
    ],
    tTetromino = [
      [width, 1, width + 1, width + 2],
      [1, width + 1, width * 2 + 1, width + 2],
      [width, width + 1, width * 2 + 1, width + 2],
      [width, 1, width + 1, width * 2 + 1]
    ],
    oTetromino = [
      [0, width, 1, width + 1],
      [0, width, 1, width + 1],
      [0, width, 1, width + 1],
      [0, width, 1, width + 1]
    ],
    iTetromino = [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3]
    ];

  const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4,
    currentRotation = 0;

  // show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;

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
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * tetrominoes.length);
      current = tetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
    }
  }

  // Move the tetromino left, unless there is a blockage or it's at the edge
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) {
      currentPosition -= 1;
    }

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }
    draw();
  }

  // Move the tetromino right, unless there is a blockage or it's at the edge
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) {
      currentPosition += 1;
    }

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw();
  }

  // Rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) { // If the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = tetrominoes[random][currentRotation]
    draw();
  }

  // Assign functions to keyCodes
  function control(e) {
    switch (e.keyCode) {
      case 37:
        moveLeft();
        break;
      case 38:
        rotate()
        break;
      case 39:
        moveRight()
        break;
      case 40:
        moveDown()
        break;
    }
  }
  document.addEventListener('keyup', control);

  // The tetrominos without rotations
  const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [displayWidth * 2, displayWidth + 1, displayWidth * 2 + 1, displayWidth + 2],
    [displayWidth, 1, displayWidth + 1, displayWidth + 2],
    [0, displayWidth, 1, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
  ];

  // Display the shape in the mini-grid display
  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    });
    upNextTetrominos[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
    });
  }

  // MAIN PROCESS
  // Randomly select a tetromino
  let random = Math.floor(Math.random() * tetrominoes.length);
  // let randomRotation = Math.floor(Math.random() * 3); // For testing
  console.log(random);
  let current = tetrominoes[random][0];

  draw();

  // Make the tetromino move down every second
  timerId = setInterval(moveDown, 1000);




  // LOGS
  console.log(squares);
  console.log(tetrominoes);
});
