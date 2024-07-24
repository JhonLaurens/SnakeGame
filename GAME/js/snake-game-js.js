// Configuración del juego
const gridSize = 20;
const cellSize = 20;
const initialSnakeLength = 3;
const initialSpeed = 200; // milisegundos

// Variables del juego
let snake = [];
let food = null;
let direction = 'right';
let score = 0;
let gameInterval = null;
let gameSpeed = initialSpeed;

// Elementos del DOM
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Inicialización del tablero
function initializeBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        gameBoard.appendChild(cell);
    }
}

// Inicialización de la culebrita
function initializeSnake() {
    snake = [];
    const middle = Math.floor(gridSize / 2);
    for (let i = 0; i < initialSnakeLength; i++) {
        snake.push({x: middle - i, y: middle});
    }
}

// Generar comida aleatoria
function generateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
        if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            break;
        }
    }
}

// Actualizar el tablero
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.className = 'cell');

    snake.forEach(segment => {
        const index = segment.y * gridSize + segment.x;
        cells[index].classList.add('snake');
    });

    const foodIndex = food.y * gridSize + food.x;
    cells[foodIndex].classList.add('food');

    scoreElement.textContent = `Puntuación: ${score}`;
}

// Mover la culebrita
function moveSnake() {
    const head = {...snake[0]};

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Verificar colisiones
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Verificar si la culebrita come
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
        increaseSpeed();
    } else {
        snake.pop();
    }

    updateBoard();
}

// Aumentar la velocidad
function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 10;
        clearInterval(gameInterval);
        gameInterval = setInterval(moveSnake, gameSpeed);
    }
}

// Finalizar el juego
function endGame() {
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'block';
}

// Iniciar el juego
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
    gameOverScreen.style.style.display = 'none';
}

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});

// Inicialización inicial
initializeBoard();
