import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Cargar Assets de Tiled y Sprites
        this.load.image('ecosistema', 'assets/tileset.png');
        this.load.tilemapTiledJSON('mapa', 'assets/map.json');
        this.load.image('ecobot', 'assets/ecoBot_sprite.png');

        // Cargar SVGs de Basura
        const svgs = [
            'plastico_botella', 'bolsa', 'vidrio_botella', 'papel_hoja',
            'papel_diario', 'papel_servilleta', 'carton_leche', 'carton_crema',
            'manzana', 'platano', 'bateria', 'movil'
        ];
        svgs.forEach(svg => this.load.svg(svg, `assets/${svg}.svg`));

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

        // Cargar SVGs de Contenedores
        const containerTypes = ['organico', 'plastico', 'papel', 'vidrio', 'ewaste'];
        containerTypes.forEach(type => this.load.svg(`container_${type}`, `assets/container_${type}.svg`));
    }

    create() {
        // Al terminar de generar texturas y cargar assets, iniciar el menú
        this.scene.start('MenuScene');
    }
}
