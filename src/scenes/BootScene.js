import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Cargar Assets (Sin map.json, mapa procedural)
        this.load.image('mapaEcoBot', 'assets/ecoBot-map.png');
        
        // Sprite animado del jugador
        this.load.atlas('ecobot', 'assets/ecoBot.png', 'assets/ecoBot.json');

        // Cargar Texture Atlas de Objetos (Items y Contenedores)
        this.load.atlas('ecoBot-objects', 'assets/ecoBot-objects.png', 'assets/ecoBot-objects.json');

        // Generar primitivas gráficas por código (ej. Fondo ajedrez)
        let graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Cuadrícula de ajedrez (fondo) 64x64
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.fillRect(32, 32, 32, 32);
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(32, 0, 32, 32);
        graphics.fillRect(0, 32, 32, 32);
        graphics.generateTexture('checkerboard', 64, 64);
        graphics.clear();
    }

    create() {
        // Al terminar de generar texturas y cargar assets, iniciar el menú
        this.scene.start('MenuScene');
    }
}
