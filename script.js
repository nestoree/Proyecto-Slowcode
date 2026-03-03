// --- 1. CARGA DE DATOS AL ABRIR LA WEB ---
let hunger = parseInt(localStorage.getItem('tamaHunger')) || 0;
let sleep = parseInt(localStorage.getItem('tamaSleep')) || 0;
let points = parseInt(localStorage.getItem('tamaPoints')) || 2332;
let foodCount = parseInt(localStorage.getItem('tamaFood')) || 0;
let petName = localStorage.getItem('tamaName') || 'TAMA-CHAN';

// Referencias a los elementos del HTML
const hungerEl = document.getElementById('hunger');
const sleepEl = document.getElementById('sleep');
const msgEl = document.getElementById('status-msg');
const foodStockEl = document.getElementById('food-stock');
const pointsEl = document.getElementById('total-points');
const nameEl = document.querySelector('.pet-name');

// --- 2. FUNCIÓN PARA ACTUALIZAR TODO Y GUARDAR ---
function updateUI() {
    // Actualizamos lo que se ve en la pantalla
    if (hungerEl) hungerEl.innerText = hunger;
    if (sleepEl) sleepEl.innerText = sleep;
    if (foodStockEl) foodStockEl.innerText = foodCount;
    if (pointsEl) pointsEl.innerText = points;
    if (nameEl) nameEl.innerText = petName;

    // GUARDAMOS en el almacenamiento del navegador
    localStorage.setItem('tamaHunger', hunger);
    localStorage.setItem('tamaSleep', sleep);
    localStorage.setItem('tamaPoints', points);
    localStorage.setItem('tamaFood', foodCount);
    
    checkStatus();
}

function buyFood() {
    if (points >= 10) {
        points -= 10;
        foodCount += 1;
        document.getElementById('status-msg').innerText = "¡Compraste una manzana! 🍎";
    } else {
        document.getElementById('status-msg').innerText = "No tienes puntos suficientes...";
    }
    updateUI();
}

function checkStatus() {
    const petImg = document.getElementById('pet-image');
    if (hunger >= 100 || sleep >= 100) {
        msgEl.innerText = "Tu mascota está muy débil... 💀";
    } else if (hunger > 75) {
        msgEl.innerText = "¡Tengo mucha hambre! 🍎";
    } else {
        msgEl.innerText = "¡Me siento genial! 😄";
    }
}

// --- 3. PASO DEL TIEMPO ---
// Cada 4 segundos suben las estadísticas y SE GUARDAN
setInterval(() => {
    if (hunger < 100) hunger += 2;
    if (sleep < 100) sleep += 1;
    updateUI(); 
}, 3000);

// --- 4. ACCIONES DE LOS BOTONES ---
function feed() {
    if (foodCount > 0) {
        if (hunger > 0) {
            hunger = Math.max(0, hunger - 20);
            foodCount--;
            msgEl.innerText = "¡Mmm, pizza! 🍕";
        } else {
            msgEl.innerText = "¡No me cabe más!";
        }
    } else {
        msgEl.innerText = "¡No hay comida! Ve al Arcade.";
    }
    updateUI();
}

let restCooldown = false;

function rest() {
        if (restCooldown) {
        document.getElementById('status-msg').innerText = "Espera 3 segundos";
        return;
    }
    
    if (sleep > 0) {
        sleep = Math.max(0, sleep - 30);
        msgEl.innerText = "Zzz... ¡Qué sueño!";
    }

    restCooldown = true;

    updateUI();
}

function toggleMenu() {
    const menu = document.getElementById("side-menu");
    const overlay = document.getElementById("overlay");
    
    // Si el menú está cerrado, lo abrimos. Si no, lo cerramos.
    if (menu.style.width === "250px") {
        menu.style.width = "0";
        overlay.style.display = "none";
    } else {
        menu.style.width = "250px";
        overlay.style.display = "block";
    }
}

// Ejecutar al cargar por primera vez
updateUI();
