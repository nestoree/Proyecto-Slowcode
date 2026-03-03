const canvas = document.getElementById('dino-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const gameOverEl = document.getElementById('game-over');
const finalPointsEl = document.getElementById('final-points');

// Configuración de pantalla completa
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Cargar imagen
const dinoImg = new Image();
dinoImg.src = '../img/image.png';

// Variables de estado
let score = 0;
let gameSpeed = 6;
let isGameOver = false;
let animationId;
let isDucking = false;

const dino = {
    x: 120,
    y: 0,
    width: 60,
    height: 60,
    originalHeight: 60,
    duckHeight: 35, // Se hace más pequeño al agacharse
    dy: 0,
    jumpForce: 10,
    gravity: 0.3,
    grounded: false
};

let obstacles = [];

function spawnObstacle() {
    const isBird = score >= 7 && Math.random() > 0.5;
    
    if (isBird) {
        // Pájaro: Aparece a media altura
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 100, // Altura para obligar a agacharse
            width: 50,
            height: 30,
            type: 'bird',
            color: '#3498db'
        });
    } else {
        // Cactus: Suelo
        let h = Math.random() * (70 - 40) + 40;
        obstacles.push({
            x: canvas.width,
            y: canvas.height - h,
            width: 30,
            height: h,
            type: 'cactus',
            color: '#27ae60'
        });
    }
}

function update() {
    if (isGameOver) return;

    // Física de Salto
    if (!dino.grounded) {
        dino.dy += dino.gravity;
        dino.y += dino.dy;
    }

    // Límite del suelo
    const currentGroundY = canvas.height - dino.height;
    if (dino.y >= currentGroundY) {
        dino.y = currentGroundY;
        dino.dy = 0;
        dino.grounded = true;
    }

    // Gestionar Obstáculos
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        o.x -= gameSpeed;

        // Colisión (Hitbox ajustada)
        if (dino.x < o.x + o.width &&
            dino.x + dino.width > o.x &&
            dino.y < o.y + o.height &&
            dino.y + dino.height > o.y) {
            endGame();
        }

        // Puntuar
        if (o.x + o.width < 0) {
            obstacles.splice(i, 1);
            score++;
            scoreEl.innerText = score;
            gameSpeed += 0.01; // Sube la velocidad poco a poco
            i--;
        }
    }

    // Generar nuevos obstáculos
    if (Math.random() < 0.02 && (obstacles.length === 0 || obstacles[obstacles.length-1].x < canvas.width - 400)) {
        spawnObstacle();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar Suelo
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width, canvas.height - 5);
    ctx.stroke();

    // Dibujar Dino (o tu imagen)
    // Si está agachado, la imagen se estira/aplasta
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Dibujar Obstáculos
    obstacles.forEach(o => {
        ctx.fillStyle = o.color;
        if(o.type === 'bird') {
            // Un triángulo simple para el pájaro
            ctx.beginPath();
            ctx.moveTo(o.x, o.y + o.height/2);
            ctx.lineTo(o.x + o.width, o.y);
            ctx.lineTo(o.x + o.width, o.y + o.height);
            ctx.fill();
        } else {
            ctx.fillRect(o.x, o.y, o.width, o.height);
        }
    });
}

function gameLoop() {
    update();
    draw();
    if (!isGameOver) animationId = requestAnimationFrame(gameLoop);
}

// Controles
window.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && dino.grounded) {
        dino.dy = -dino.jumpForce;
        dino.grounded = false;
        if(isDucking) stopDuck();
    }
    if (e.code === 'ArrowDown') startDuck();
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') stopDuck();
});

function startDuck() {
    if(dino.grounded) {
        isDucking = true;
        dino.height = dino.duckHeight;
        dino.y = canvas.height - dino.height; // Reajustar al suelo
    }
}

function stopDuck() {
    isDucking = false;
    dino.height = dino.originalHeight;
    dino.y = canvas.height - dino.height;
}

function endGame() {
    isGameOver = true;
    finalPointsEl.innerText = score;
    gameOverEl.classList.remove('hidden');
    
    let total = parseInt(localStorage.getItem('tamaPoints')) || 0;
    localStorage.setItem('tamaPoints', total + score);
}

function resetGame() {
    score = 0;
    gameSpeed = 6;
    obstacles = [];
    isGameOver = false;
    scoreEl.innerText = "0";
    gameOverEl.classList.add('hidden');
    dino.y = canvas.height - dino.height;
    gameLoop();
}

dinoImg.onload = gameLoop;