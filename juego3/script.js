const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const roundEl = document.getElementById('round');
const gameOverEl = document.getElementById('game-over');
const playerHealthBar = document.getElementById('player-health-bar');
const bossHealthBar = document.getElementById('boss-health-bar');
const bossUI = document.getElementById('boss-ui');

// Configuración de pantalla completa
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Cargar Imágenes
const playerImg = new Image(); playerImg.src = '../img/image.png';
const invaderImg = new Image(); invaderImg.src = '../img/invader.png';
const bossImg = new Image(); bossImg.src = '../img/invader.png';
const heartImg = new Image(); heartImg.src = 'https://cdn-icons-png.flaticon.com/512/833/833472.png'; // Icono de vida

// Variables de Estado
let score = 0;
let currentRound = 1;
let isGameOver = false;
let isBossLevel = false;
let invaderDirection = 1;

// Objetos del Juego
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 60,
    height: 60,
    hp: 100,
    maxHp: 100,
    speed: 9,
    bullets: []
};

let invaders = [];
let enemyBullets = [];
let lifePowerUps = []; // Lista de corazones cayendo
let boss = null;

// Inicializar Ronda o Jefe
function initRound() {
    invaders = [];
    enemyBullets = [];
    player.bullets = [];
    lifePowerUps = [];
    isBossLevel = currentRound % 3 === 0;
    invaderDirection = 1;

    if (isBossLevel) {
        boss = {
            x: canvas.width / 2 - 100,
            y: 80,
            width: 200,
            height: 150,
            hp: 500,
            maxHp: 500,
            speed: 3 + (currentRound * 0.4),
            direction: 1
        };
        bossUI.classList.remove('hidden');
        bossHealthBar.style.width = "100%";
    } else {
        boss = null;
        bossUI.classList.add('hidden');
        const rows = 4;
        const cols = 10;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                invaders.push({
                    x: c * 75 + 100,
                    y: r * 65 + 100,
                    width: 45,
                    height: 45,
                    alive: true,
                    row: r,
                    col: c
                });
            }
        }
    }
    roundEl.innerText = currentRound;
}

// Controles
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Space' && !isGameOver) {
        if (player.bullets.length < 6) {
            player.bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, speed: 12 });
        }
    }
});
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
    if (isGameOver) return;

    // Movimiento Jugador
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

    // Balas Jugador
    player.bullets.forEach((b, i) => {
        b.y -= b.speed;
        if (b.y < 0) player.bullets.splice(i, 1);

        if (isBossLevel && boss) {
            if (b.x > boss.x && b.x < boss.x + boss.width && b.y > boss.y && b.y < boss.y + boss.height) {
                boss.hp -= 10;
                player.bullets.splice(i, 1);
                score += 5;
                bossHealthBar.style.width = (boss.hp / boss.maxHp * 100) + "%";
                if (boss.hp <= 0) {
                    score += 500;
                    currentRound++;
                    initRound();
                }
            }
        } else {
            invaders.forEach(inv => {
                if (inv.alive && b.x > inv.x && b.x < inv.x + inv.width && b.y > inv.y && b.y < inv.y + inv.height) {
                    inv.alive = false;
                    player.bullets.splice(i, 1);
                    score += 1;

                    // PROBABILIDAD 45% DE SOLTAR VIDA
                    if (Math.random() < 0.10) {
                        lifePowerUps.push({
                            x: inv.x + inv.width / 2 - 12,
                            y: inv.y,
                            width: 25,
                            height: 25,
                            speed: 3
                        });
                    }
                }
            });
        }
    });

    // Lógica de Invasores / Jefe
    if (isBossLevel && boss) {
        boss.x += boss.speed * boss.direction;
        if (boss.x + boss.width >= canvas.width - 20 || boss.x <= 20) boss.direction *= -1;
        if (Math.random() < 0.07) {
            enemyBullets.push({ x: boss.x + Math.random() * boss.width, y: boss.y + boss.height, speed: 7 });
        }
    } else {
        let edgeReached = false;
        let currentSpeed = (2 + currentRound * 0.3) * invaderDirection;

        invaders.forEach(inv => {
            if (!inv.alive) return;
            inv.x += currentSpeed;
            if (inv.x + inv.width >= canvas.width - 15 || inv.x <= 15) edgeReached = true;
            if (inv.y + inv.height >= player.y) endGame();

            const isFront = !invaders.some(other => other.alive && other.col === inv.col && other.row > inv.row);
            if (isFront && Math.random() < 0.006 + (currentRound * 0.001)) {
                enemyBullets.push({ x: inv.x + inv.width / 2, y: inv.y + inv.height, speed: 5 + currentRound * 0.2 });
            }
        });

        if (edgeReached) {
            invaderDirection *= -1;
            invaders.forEach(inv => {
                inv.y += 35;
                inv.x += invaderDirection * 10;
            });
        }

        if (invaders.length > 0 && invaders.every(inv => !inv.alive)) {
            currentRound++;
            initRound();
        }
    }

    // Balas Enemigas
    enemyBullets.forEach((eb, i) => {
        eb.y += eb.speed;
        if (eb.y > canvas.height) enemyBullets.splice(i, 1);
        if (eb.x > player.x && eb.x < player.x + player.width && eb.y > player.y && eb.y < player.y + player.height) {
            player.hp -= 5;
            enemyBullets.splice(i, 1);
            playerHealthBar.style.width = Math.max(0, player.hp) + "%";
            if (player.hp <= 0) endGame();
        }
    });

    // Lógica de Power-ups de Vida
    lifePowerUps.forEach((lp, i) => {
        lp.y += lp.speed;
        if (lp.y > canvas.height) lifePowerUps.splice(i, 1);
        
        // Colisión con Jugador (Curación)
        if (lp.x < player.x + player.width && lp.x + lp.width > player.x &&
            lp.y < player.y + player.height && lp.y + lp.height > player.y) {
            
            player.hp = Math.min(100, player.hp + 20);
            playerHealthBar.style.width = player.hp + "%";
            lifePowerUps.splice(i, 1);
            
            // Efecto visual de curación
            playerHealthBar.style.backgroundColor = "#00ffff";
            setTimeout(() => playerHealthBar.style.backgroundColor = "#00ff00", 200);
        }
    });

    scoreEl.innerText = score;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Nave Jugador
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Balas Jugador
    ctx.fillStyle = "#00ff00";
    player.bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 12));

    // Balas Enemigas
    ctx.fillStyle = "#ff0000";
    enemyBullets.forEach(eb => ctx.fillRect(eb.x, eb.y, 5, 15));

    // Power-ups de Vida
    lifePowerUps.forEach(lp => {
        ctx.drawImage(heartImg, lp.x, lp.y, lp.width, lp.height);
    });

    // Enemigos
    if (isBossLevel && boss) {
        ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);
    } else {
        invaders.forEach(inv => {
            if (inv.alive) ctx.drawImage(invaderImg, inv.x, inv.y, inv.width, inv.height);
        });
    }
}

function endGame() {
    isGameOver = true;
    document.getElementById('final-points').innerText = score;
    gameOverEl.classList.remove('hidden');
    let totalSaved = parseInt(localStorage.getItem('tamaPoints')) || 0;
    localStorage.setItem('tamaPoints', totalSaved + score);
}

function gameLoop() {
    update();
    draw();
    if (!isGameOver) requestAnimationFrame(gameLoop);
}

initRound();
gameLoop();