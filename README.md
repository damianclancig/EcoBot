# 🤖 EcoBot - Aventura de Reciclaje en 2D

EcoBot es un videojuego educativo de aventuras en formato Top-Down desarrollado en JavaScript. El objetivo principal del juego es enseñar a clasificar correctamente los residuos para restaurar un ecosistema altamente contaminado.

## 🌟 Características Principales

*   **Exploración Libre:** Un mapa dinámico de 1600x1600 píxeles generado de manera procedimental.
*   **Inventario Táctico (FIFO):** Sistema de recolección en forma de cola. El primer objeto que recoges es el primero que debes reciclar, fomentando la estrategia al moverse por el mapa.
*   **Restauración Visual en Tiempo Real:** El entorno pasa de estar cubierto por una densa capa de *smog* oscuro a un ecosistema limpio y brillante a medida que reciclas los desechos.
*   **Múltiples Categorías de Residuos:** Incluye clasificación para Plástico, Vidrio, Papel, Basura Orgánica y Residuos Electrónicos (E-waste).
*   **Diseño Vectorial:** Assets escalables y limpios en formato SVG, interfaz de usuario (HUD) minimalista e intuitiva.

## 🛠️ Tecnologías Utilizadas

*   [Phaser 3](https://phaser.io/) - Motor gráfico principal y de físicas (Arcade Physics).
*   **Vite** - Herramienta de compilación rápida y servidor de desarrollo.
*   **Node.js** - Utilizado para los scripts de auto-generación de mapas y manipulación de archivos SVG.

## 🎮 Cómo Jugar

Ayuda a EcoBot a encontrar y recolectar todas las piezas de basura dispersas en la ciudad y deposítalas en los contenedores adecuados. 

*   **Flechas del Teclado (⬆️ ⬇️ ⬅️ ➡️)**: Mover a EcoBot.
*   **Barra Espaciadora**: Depositar el objeto activo (el que está parpadeando en la esquina superior izquierda del HUD) en el contenedor frente a ti.

¡Cuidado! Si te equivocas de contenedor perderás puntos y el objeto volverá a dispersarse en algún lugar aleatorio de la ciudad. El juego se gana cuando la contaminación llega al 0%.

## 🚀 Instalación y Uso Local

Para correr este proyecto en tu entorno local, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/damianclancig/EcoBot.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd EcoBot
   ```
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre la URL local generada (generalmente `http://localhost:5173`) en tu navegador de preferencia.

## 🤝 Contribuciones y Desarrollo

El proyecto utiliza un sistema modular (`PlayerController`, `EnvironmentController`, `InventoryManager`) que hace muy sencilla la escalabilidad. Adicionalmente, cuenta con scripts ejecutables en la carpeta `/scripts` que te permiten regenerar el mapa o los archivos SVG fácilmente.

---
*Desarrollado como iniciativa de concientización ambiental.*
