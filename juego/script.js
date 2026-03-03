const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');

// Ajuste dinámico al tamaño de la ventana
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- Variables del Juego ---
let score = 0;
let isGameOver = false;

// Pájaro
let birdX = 50;
let birdY = canvas.height / 2;
let birdSize = 95; 
let birdVelocity = 0;
let gravity = 0.1;
let jump = -5;

// Cargar imagen del personaje
const birdImage = new Image();
birdImage.src = '../img/image.png'; 
let imageLoaded = false;
birdImage.onload = () => { imageLoaded = true; };

// Tuberías
let pipes = [];
let pipeWidth = 80;
let pipeGap = 300;
let pipeSpeed = 3;
let pipeSpawnTimer = 0;

function resetVariables() {
    score = 0;
    isGameOver = false;
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    pipeSpawnTimer = 0;
    
    // Inicializar unas cuantas nubes al azar
    clouds = [];
    for(let i = 0; i < 5; i++) {
        let c = createCloud();
        c.x = Math.random() * canvas.width; // Esparcirlas por toda la pantalla al inicio
        clouds.push(c);
    }
    
    gameOverScreen.classList.add('hidden');
}

function drawCloud(x, y, size) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.35, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.7, y, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
}



function update() {
    if (isGameOver) return;

    // Física
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Colisión Suelo/Techo
    if (birdY + birdSize > canvas.height || birdY < 0) {
        endGame();
    }

    if (isGameOver) return;

    // Mover nubes (siempre se mueven, incluso si el pájaro no salta)
    clouds.forEach(c => {
        c.x -= c.speed;
        if (c.x + c.size < 0) {
            Object.assign(c, createCloud());
        }
    });

    // Generar tuberías
    if (pipeSpawnTimer <= 0) {
        const minPipeHeight = 50;
        const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
        const pipeY = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;
        pipes.push({ x: canvas.width, y: pipeY, scored: false });
        pipeSpawnTimer = 120; // Aparece una cada 120 frames aprox
    }
    pipeSpawnTimer--;

    // Mover tuberías
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x -= pipeSpeed;

        // Colisión con tubería
        if (birdX < p.x + pipeWidth &&
            birdX + birdSize > p.x &&
            (birdY < p.y || birdY + birdSize > p.y + pipeGap)) {
            endGame();
        }

        // Puntaje
        if (!p.scored && p.x + pipeWidth < birdX) {
            score++;
            p.scored = true;
        }

        // Eliminar si salen de pantalla
        if (p.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }
}

let clouds = [];
const cloudSpeedBase = 0.5; // Velocidad de las nubes (más lento que las tuberías)

function createCloud() {
    return {
        x: canvas.width + Math.random() * 200,
        y: Math.random() * (canvas.height / 2), // Solo en la mitad superior
        size: 50 + Math.random() * 50,
        speed: cloudSpeedBase + Math.random() * 0.5
    };
}

function draw() {
    // 1. Limpiar fondo
    ctx.fillStyle = '#6ab0e5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1.5 DIBUJAR NUBES (Detrás de todo)
    clouds.forEach(c => drawCloud(c.x, c.y, c.size));

    // 2. Dibujar Tuberías
    ctx.fillStyle = '#2ecc71'; // Verde llamativo
    pipes.forEach(p => {
        // Tubería superior
        ctx.fillRect(p.x, 0, pipeWidth, p.y);
        ctx.strokeStyle = '#1d8348';
        ctx.lineWidth = 4;
        ctx.strokeRect(p.x, 0, pipeWidth, p.y);

        // Tubería inferior
        ctx.fillRect(p.x, p.y + pipeGap, pipeWidth, canvas.height);
        ctx.strokeRect(p.x, p.y + pipeGap, pipeWidth, canvas.height);
    });

    // 3. Dibujar Personaje
    if (imageLoaded) {
        ctx.drawImage(birdImage, birdX, birdY, birdSize, birdSize);
    } else {
        // Si la imagen no carga, dibuja un cuadro amarillo de emergencia
        ctx.fillStyle = 'yellow';
        ctx.fillRect(birdX, birdY, birdSize, birdSize);
    }

    // 4. Dibujar Score
    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(`Puntos: ${score}`, 20, 60);
    ctx.fillText(`Puntos: ${score}`, 20, 60);
}

function gameLoop() {
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function endGame() {
    isGameOver = true;
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove('hidden');

    // Guardar puntos en LocalStorage
    let totalSavedPoints = parseInt(localStorage.getItem('tamaPoints')) || 0;
    totalSavedPoints += score;
    localStorage.setItem('tamaPoints', totalSavedPoints);
}

function resetGame() {
    resetVariables();
    gameLoop();
}

// Controles
const handleAction = () => { if (!isGameOver) birdVelocity = jump; };
window.addEventListener('keydown', (e) => { if(e.code === 'Space') handleAction(); });
canvas.addEventListener('mousedown', handleAction);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleAction(); });

resetVariables();
gameLoop();
