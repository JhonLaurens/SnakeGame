<?php
session_start();

// Game settings
$gameSettings = [
    'gameTitle' => "Snake Game",
    'gridSize' => 20,
    'initialSnakeLength' => 3,
    'initialSpeed' => 200
];

// Function to get high scores
function getHighScores() {
    if (!file_exists('high_scores.json')) {
        return [];
    }
    $scores = json_decode(file_get_contents('high_scores.json'), true);
    arsort($scores);
    return array_slice($scores, 0, 5);
}

// Function to save high score
function saveHighScore($name, $score) {
    $scores = getHighScores();
    $scores[$name] = $score;
    arsort($scores);
    $scores = array_slice($scores, 0, 5);
    file_put_contents('high_scores.json', json_encode($scores));
}

// Handle high score submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['name']) && isset($_POST['score'])) {
    saveHighScore($_POST['name'], intval($_POST['score']));
    exit;
}

// Get high scores
$highScores = getHighScores();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title><?php echo htmlspecialchars($gameSettings['gameTitle']); ?></title>
    <link rel="stylesheet" href="./css/snake-game.css">
</head>
<body>
    <div id="main-container">
        <div id="game-container">
            <h1><?php echo htmlspecialchars($gameSettings['gameTitle']); ?></h1>
            <div id="score">Score: 0</div>
            <div id="game-board"></div>
        </div>
        <div id="button-container">
            <button id="start-button">Start Game</button>
        </div>
    </div>
    <div id="game-over">
        <h2>Game Over</h2>
        <p>Your final score: <span id="final-score"></span></p>
        <form id="high-score-form">
            <input type="text" id="player-name" placeholder="Enter your name" required>
            <button type="submit">Submit Score</button>
        </form>
        <button id="restart-button">Restart</button>
    </div>
    <div id="high-scores">
        <h2>High Scores</h2>
        <ul>
            <?php foreach ($highScores as $name => $score): ?>
                <li><?php echo htmlspecialchars($name) . ': ' . $score; ?></li>
            <?php endforeach; ?>
        </ul>
    </div>

    <script>
        // Pass PHP variables to JavaScript
        const gameSettings = <?php echo json_encode($gameSettings); ?>;
    </script>
    <script src="./js/snake-game.js"></script>
</body>
</html>