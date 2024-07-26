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
    <link rel="stylesheet" href="css/snake-game.css">
    <style>
        body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100%;
        }
        #rain-canvas {
            display: block;
            background: linear-gradient(to bottom, #1a1a2e, #16213e);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        #game-container, #game-over {
            position: relative;
            z-index: 1;
        }
    </style>
</head>
<body>
    <canvas id="rain-canvas"></canvas>
    <div id="game-container">
        <h1><?php echo $gameTitle; ?></h1>
        <div id="score">Puntuación: 0</div>
        <div id="game-board"></div>
        <button id="start-button">Iniciar Juego</button>
    </div>
    <div id="game-over" style="display: none;">
        <h2>Juego Terminado</h2>
        <p>Tu puntuación final: <span id="final-score"></span></p>
        <button id="restart-button">Reiniciar</button>
    </div>
    <script src="js/snake-game.js"></script>
    <script>
        const canvas = document.getElementById('rain-canvas');
        const ctx = canvas.getContext('2d');
        let raindrops = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Raindrop {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.length = Math.random() * 20 + 10;
                this.speed = Math.random() * 5 + 2;
                this.thickness = Math.random() * 1.5 + 0.5;
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.length);
                ctx.strokeStyle = `rgba(174, 194, 224, ${Math.random() * 0.5 + 0.5})`;
                ctx.lineWidth = this.thickness;
                ctx.stroke();
            }
        }

        function createRaindrops(count) {
            raindrops = [];
            for (let i = 0; i < count; i++) {
                raindrops.push(new Raindrop());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            raindrops.forEach(raindrop => {
                raindrop.update();
                raindrop.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createRaindrops(500);
        });

        createRaindrops(500);
        animate();
    </script>
</body>
</html>