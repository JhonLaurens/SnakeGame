<?php
// Aquí puedes agregar cualquier lógica de servidor que necesites en el futuro
$gameTitle = "Juego de Culebrita";
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $gameTitle; ?></title>
    <link rel="stylesheet" href="./GAME/css/snake-game-css.css">
</head>
<body>
    <div id="game-container">
        <h1><?php echo $gameTitle; ?></h1>
        <div id="score">Puntuación: 0</div>
        <div id="game-board"></div>
        <button id="start-button">Iniciar Juego</button>
    </div>
    <div id="game-over">
        <h2>Juego Terminado</h2>
        <p>Tu puntuación final: <span id="final-score"></span></p>
        <button id="restart-button">Reiniciar</button>
    </div>

    <script src="./GAME/js/snake-game-js.js"></script>
</body>
</html>
