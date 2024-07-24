// GAME\js\snake-game.js

// Game configuration (now from PHP)
const gridSize = gameSettings.gridSize;
const initialSnakeLength = gameSettings.initialSnakeLength;
const initialSpeed = gameSettings.initialSpeed; // milliseconds

// Game variables
let snake = [];
let food = null;
let direction = 'right';
let score = 0;
let gameInterval = null;
let gameSpeed = initialSpeed;

// DOM elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Initialize the board
function initializeBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        gameBoard.appendChild(cell);
    }
}

// Initialize the snake
function initializeSnake() {
    snake = [];
    const middle = Math.floor(gridSize / 2);
    for (let i = 0; i < initialSnakeLength; i++) {
        snake.push({x: middle - i, y: middle});
    }
}

// Generate random food
function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Update the board
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.className = 'cell');

    snake.forEach((segment, index) => {
        const cellIndex = segment.y * gridSize + segment.x;
        cells[cellIndex].classList.add('snake');
        if (index === 0) cells[cellIndex].classList.add('snake-head');
    });

    const foodIndex = food.y * gridSize + food.x;
    cells[foodIndex].classList.add('food');

    scoreElement.textContent = `Score: ${score}`;
}

// Move the snake
function moveSnake() {
    const head = {...snake[0]};

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Check collisions
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
        increaseSpeed();
    } else {
        snake.pop();
    }

    updateBoard();
}

// Increase speed
function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 5;
        clearInterval(gameInterval);
        gameInterval = setInterval(moveSnake, gameSpeed);
    }
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'block';
    document.getElementById('high-score-form').style.display = 'block';
}

// Start the game
function startGame() {
    initializeBoard();
    initializeSnake();
    generateFood();
    direction = 'right';
    score = 0;
    gameSpeed = initialSpeed;
    updateBoard();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, gameSpeed);
    startButton.disabled = true;
    gameOverScreen.style.display = 'none';
}

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

gameBoard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

gameBoard.addEventListener('touchend', (e) => {
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;
    handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
}, false);

function handleSwipe(startX, startY, endX, endY) {
    const dx = endX - startX;
    const dy = endY - startY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== 'left') direction = 'right';
        else if (dx < 0 && direction !== 'right') direction = 'left';
    } else {
        if (dy > 0 && direction !== 'up') direction = 'down';
        else if (dy < 0 && direction !== 'down') direction = 'up';
    }
}

// High score submission
document.getElementById('high-score-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('player-name').value;
    
    fetch('snake-game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `name=${encodeURIComponent(name)}&score=${score}`
    })
    .then(response => response.text())
    .then(() => {
        alert('High score submitted!');
        location.reload(); // Reload to update high scores
    })
    .catch(error => console.error('Error:', error));
});

// Initial board setup
initializeBoard();