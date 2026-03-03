let hunger = 0;
let sleep = 0;
// Cargar datos del almacenamiento local o empezar de cero
let points = parseInt(localStorage.getItem('tamaPoints')) || 0;
let foodCount = parseInt(localStorage.getItem('tamaFood')) || 0;

function updateUI() {
    document.getElementById('hunger').innerText = hunger;
    document.getElementById('sleep').innerText = sleep;
    document.getElementById('total-points').innerText = points;
    document.getElementById('food-stock').innerText = foodCount;
    
    // Guardar en el navegador
    localStorage.setItem('tamaPoints', points);
    localStorage.setItem('tamaFood', foodCount);
}

// Comprar comida
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



function feed() {
    if (foodCount > 0) {
        if (hunger > 0) {
            hunger -= 25;
            if (hunger < 0) hunger = 0;
            foodCount -= 1;
            document.getElementById('status-msg').innerText = "¡Qué rico!";
        } else {
            document.getElementById('status-msg').innerText = "No tengo hambre ahora.";
        }
    } else {
        document.getElementById('status-msg').innerText = "¡No hay comida! Ve al arcade.";
    }
    updateUI();
}
let restCooldown = false;

function rest() {
    if (restCooldown) {
        document.getElementById('status-msg').innerText = "Espera 3 segundos";
        return;
    }

    restCooldown = true;

    sleep = Math.max(0, sleep - 5);
    document.getElementById('status-msg').innerText = "Zzz...";
    updateUI();

    setTimeout(() => {
        restCooldown = false;
    }, 3000);
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

// Ciclo natural
setInterval(() => {
    hunger = Math.min(100, hunger + 2);
    sleep = Math.min(100, sleep + 1);
    updateUI();
}, 4000);

// Al cargar la página por primera vez
updateUI();