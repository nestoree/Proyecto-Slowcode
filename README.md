# 🐾 Tamagotchi
¡Bienvenido a Tamagotchi Este proyecto incluye tres juegos arcade, una tienda funcional, una red social y persistencia de datos en tiempo real.

---

## 🚀 Guía de Módulos del Proyecto
El ecosistema se compone de los siguientes archivos y carpetas interconectados:

---

## 1. 🏠 Núcleo: La Estancia

Es el centro de mando. Aquí cuidas a tu mascota y gestionas sus necesidades básicas.
- Persistencia Total: Gracias al uso de **LocalStorage**, el hambre, el sueño, los puntos y el inventario de comida no se reinician al cerrar el navegador o cambiar de juego.
- Ciclo de Vida Activo: Las estadísticas suben automáticamente cada 3 segundos, obligándote a jugar para ganar comida.
- UI Dinámica: Los estados de la mascota cambian visualmente (mensajes) según su salud.

---

## 2. 🎮 Arcade: El Centro de Juegos

Hemos implementado tres experiencias distintas para ganar Puntos Tama:

Juego 1: Flappy-Tama: Esquiva tuberías para ganar puntos rápidos.
Juego 2: Tama-run: Mecánica: Salta obstáculos y agáchate (Flecha Abajo) para esquivar pájaros.
- Dificultad Progresiva: A partir de los 7 puntos aparecen enemigos aéreos.
Juego 3: Tama-invaders:
- Combate: Destruye oleadas de aliens que disparan de forma inteligente.
- Jefe Final: Cada 3 rondas aparece un Boss con 500 HP.
- Sistema de Curación: Los aliens tienen un 15% de probabilidad de soltar corazones de vida para reparar tu nave.

---

## 3. 💖 Tama-Match

Un sistema social de "Swipe" para buscar pareja a tu mascota.
- Matches Infinitos: Notificaciones flotantes que no interrumpen la navegación.
- Colección: Los matches se guardan visualmente en la parte inferior de la pantalla.

---

## 4. 🛍️ Tama-Shop

Intercambia tus puntos ganados en el Arcade por suministros.
- Sincronización: Las compras se reflejan instantáneamente en el inventario de la estancia principal.

---

## 5. 📝 Nota del Proyecto

Una sección informativa sobre el desarrollo:
- Compatibilidad: Aviso importante sobre la optimización exclusiva para PC.
- Créditos: Desarrollado por Néstor, Edgar y Mario bajo el sello Slowcode.

---

🛠️ Especificaciones Técnicas
- Lenguajes: HTML5, CSS3, JavaScript Vanilla (Sin librerías externas).
- Gráficos: Sistema mixto de Pixel Art y Sprites dinámicos.
- Almacenamiento: localStorage para guardar el estado de la partida entre sesiones.
- Física de Juegos: Motores de colisión personalizados (AABB Collision Detection) para asegurar precisión en los saltos y disparos.
