document.addEventListener('DOMContentLoaded', () => {
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const grid = document.querySelector('.grid'),
    scoreDisplay = document.querySelector('#score'),
    startBtn = document.querySelector('#start-button'),
    displaySquares = document.querySelectorAll('.mini-grid div'),
    width = 10,
    displayWidth = 4,
    displayIndex = 0,
    colors = [
      'orange',
      'red',
      'purple',
      'green',
      'blue'
    ];

  // Defining tetrominoes
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
    ],
    tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino],

    // First rotations of tetrominoes to display
    upNextTetrominos = [
      [1, displayWidth + 1, displayWidth * 2 + 1, 2],
      [displayWidth * 2, displayWidth + 1, displayWidth * 2 + 1, displayWidth + 2],
      [displayWidth, 1, displayWidth + 1, displayWidth + 2],
      [0, displayWidth, 1, displayWidth + 1],
      [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ];

  // Randomly select a tetromino
  let random = Math.floor(Math.random() * tetrominoes.length),
    current = tetrominoes[random][0],
    nextRandom = 0,
    timerId,
    score = 0,
    currentPosition = 4,
    currentRotation = 0;

  // Draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  // Undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  // Move down the Tetromino
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
      addScore();
      gameOver();
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
    current = tetrominoes[random][currentRotation];
    draw();
  }

  // Assign functions to keyCodes
  function control(e) {
    switch (e.keyCode) {
      case 37:
        moveLeft();
        break;
      case 38:
        rotate();
        break;
      case 39:
        moveRight();
        break;
      case 40:
        moveDown();
        break;
    }
  }
  document.addEventListener('keyup', control);

  // Display the shape of next tetromino in the mini-grid display
  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });

    upNextTetrominos[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }

  // Add functionality to the Start/Pause button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * tetrominoes.length);
      displayShape();
    }
  });

  // Add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });

        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  // Game Over
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'End';
      clearInterval(timerId);
    }
  }
});
