import Phaser from 'phaser';
import PlayerController from '../controllers/PlayerController.js';
import EnvironmentController from '../controllers/EnvironmentController.js';
import InventoryManager from '../managers/InventoryManager.js';
import ItemFactory from '../factories/ItemFactory.js';
import ContainerFactory from '../factories/ContainerFactory.js';
import events, { EVENTS } from '../utils/Events.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Iniciar la UIScene en paralelo
        this.scene.launch('UIScene');

        // Generar matriz 2D procedural (pasillos de supermercado o laberinto)
        const rows = 24;
        const cols = 24;
        
        // Crear matriz base de baja resolución para agrupar tiles (2x2)
        const baseRows = Math.ceil(rows / 2);
        const baseCols = Math.ceil(cols / 2);
        const baseTiles = [];
        for (let by = 0; by < baseRows; by++) {
            const bRow = [];
            for (let bx = 0; bx < baseCols; bx++) {
                bRow.push(Phaser.Math.Between(0, 2));
            }
            baseTiles.push(bRow);
        }

        const levelMatrix = [];
        for (let y = 0; y < rows; y++) {
            const row = [];
            for (let x = 0; x < cols; x++) {
                // Borde sólido (3 horizontal, 4 vertical)
                if (y === 0 || y === rows - 1) {
                    row.push(3);
                } else if (x === 0 || x === cols - 1) {
                    row.push(4);
                } 
                // Patrón de estantes horizontales
                else if (y % 5 === 0 && x > 3 && x < cols - 3) {
                    row.push(3);
                }
                // Patrón de estantes verticales
                else if (x % 6 === 0 && y > 3 && y < rows - 3 && y % 5 !== 2) {
                    row.push(4);
                }
                // Piso caminable (agrupado en bloques de 2x2 mediante la matriz base)
                else {
                    const bx = Math.floor(x / 2);
                    const by = Math.floor(y / 2);
                    row.push(baseTiles[by][bx]);
                }
            }
            levelMatrix.push(row);
        }

        // Crear Tilemap basado en matriz procedural
        const map = this.make.tilemap({ data: levelMatrix, tileWidth: 64, tileHeight: 64 });
        const tileset = map.addTilesetImage('mapaEcoBot');
        this.groundLayer = map.createLayer(0, tileset, 0, 0);

        // Setear colisiones para los IDs sólidos sucios (3, 4) y limpios (8, 9)
        if (this.groundLayer) {
            this.groundLayer.setCollision([3, 4, 8, 9]);
        }

        // Añadir textura de ajedrez debajo como fondo sutil
        const bgGrid = this.add.tileSprite(0, 0, map.widthInPixels, map.heightInPixels, 'checkerboard');
        bgGrid.setOrigin(0, 0);
        bgGrid.setAlpha(0.1);
        bgGrid.setDepth(-1);

        // Límites del mundo según mapa procedural
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Controladores y Managers
        this.inventoryManager = new InventoryManager(5);
        
        // Entidades
        this.player = new PlayerController(this, 128, 128); // spawn lejos del borde
        this.cameras.main.startFollow(this.player.sprite);
        
        // Colisión jugador vs mapa
        if (this.groundLayer) {
            this.physics.add.collider(this.player.sprite, this.groundLayer);
        }

        // Factories - Generación Aleatoria
        this.itemsGroup = ItemFactory.createRandomItems(this, this.groundLayer, 20);
        this.containersGroup = ContainerFactory.createContainers(this, this.groundLayer);

        // Medio Ambiente
        this.environment = new EnvironmentController(this, this.itemsGroup, this.groundLayer);

        // Input
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Interacciones (Overlaps y Colisiones)
        this.physics.add.overlap(this.player.sprite, this.itemsGroup, this.collectItem, null, this);
        this.physics.add.overlap(this.player.sprite, this.containersGroup, this.recycleItems, null, this);
        if (this.groundLayer) {
            this.physics.add.collider(this.containersGroup, this.groundLayer);
        }
        
        // Eventos
        events.on(EVENTS.WRONG_CONTAINER, this.scatterItem, this);
        events.on(EVENTS.MOBILE_ACTION, this.handleMobileAction, this);
        events.on(EVENTS.ENVIRONMENT_RESTORED, this.checkWinCondition, this);
        
        // Limpieza de eventos al destruir la escena
        this.events.once('shutdown', () => {
            events.off(EVENTS.WRONG_CONTAINER, this.scatterItem, this);
            events.off(EVENTS.MOBILE_ACTION, this.handleMobileAction, this);
            events.off(EVENTS.ENVIRONMENT_RESTORED, this.checkWinCondition, this);
        });
    }

    update() {
        this.player.update();
    }

    collectItem(playerSprite, item) {
        const itemData = {
            type: item.getData('itemType'),
            x: item.x,
            y: item.y
        };

        if (this.inventoryManager.addItem(itemData)) {
            events.emit(EVENTS.ITEM_PICKED, {
                playerInfo: { x: playerSprite.x, y: playerSprite.y }
            });
            item.destroy();
        }
    }

    recycleItems(playerSprite, container) {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.processRecycle(container);
        }
    }

    handleMobileAction() {
        this.physics.world.overlap(this.player.sprite, this.containersGroup, (player, container) => {
            this.processRecycle(container);
        });
    }

    processRecycle(container) {
        const containerType = container.getData('containerType');
        const recycleResult = this.inventoryManager.recycle(containerType);
        
        if (recycleResult.validItems > 0) {
            events.emit(EVENTS.CORRECT_RECYCLE, {
                containerInfo: { x: container.x, y: container.y },
                validItems: recycleResult.validItems,
                itemData: recycleResult.itemData
            });
        }
    }

    checkWinCondition(data) {
        if (data.percentage >= 100) {
            const uiScene = this.scene.get('UIScene');
            const finalScore = uiScene ? uiScene.score : 0;
            
            this.time.delayedCall(1500, () => {
                this.scene.stop('UIScene');
                this.scene.start('WinScene', { score: finalScore });
            });
        }
    }

    scatterItem(data) {
        const itemsToScatter = Array.isArray(data.items) ? data.items : (data.item ? [data.item] : []);
        if (itemsToScatter.length > 0) {
            ItemFactory.scatterPenalty(this, this.itemsGroup, this.groundLayer, itemsToScatter.length, itemsToScatter);
        }
    }
}
