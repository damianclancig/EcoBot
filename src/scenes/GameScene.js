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

        // Cargar mapa Tiled
        const map = this.make.tilemap({ key: 'mapa' });
        const tileset = map.addTilesetImage('ecosistema', 'ecosistema');
        
        // Capas
        const capaLimpia = map.createLayer('Limpia', tileset, 0, 0);
        this.capaSucia = map.createLayer('Sucia', tileset, 0, 0);

        // Añadir textura de ajedrez sobre el suelo para notar el movimiento
        const bgGrid = this.add.tileSprite(0, 0, map.widthInPixels, map.heightInPixels, 'checkerboard');
        bgGrid.setOrigin(0, 0);
        bgGrid.setAlpha(0.1); // Opacidad suave del 10%

        // Límites del mundo según mapa
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Controladores y Managers
        this.inventoryManager = new InventoryManager(5);
        
        // Entidades
        this.player = new PlayerController(this, 100, 100);
        this.cameras.main.startFollow(this.player.sprite);

        // Factories - Generación Aleatoria en mapa de 1600x1600
        const itemTypes = [
            'manzana', 'platano', 'plastico_botella', 'bolsa', 'vidrio_botella',
            'papel_hoja', 'papel_diario', 'papel_servilleta', 'carton_leche', 
            'carton_crema', 'bateria', 'movil'
        ];

        const randomItemsData = itemTypes.map(type => ({
            x: Phaser.Math.Between(50, 1550),
            y: Phaser.Math.Between(50, 1550),
            type: type
        }));
        
        this.itemsGroup = ItemFactory.createItems(this, randomItemsData);

        const containerTypes = ['organico', 'plastico', 'papel', 'vidrio', 'ewaste'];
        const randomContainersData = containerTypes.map(type => ({
            x: Phaser.Math.Between(100, 1500),
            y: Phaser.Math.Between(100, 1500),
            type: type
        }));

        const containers = ContainerFactory.createContainers(this, randomContainersData);

        // Medio Ambiente
        this.environment = new EnvironmentController(this, this.itemsGroup.getChildren().length, this.capaSucia);

        // Input
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Interacciones (Overlaps)
        this.physics.add.overlap(this.player.sprite, this.itemsGroup, this.collectItem, null, this);
        this.physics.add.overlap(this.player.sprite, containers, this.recycleItems, null, this);
        
        // Dispersar basura si se tira en el contenedor equivocado
        events.on(EVENTS.WRONG_CONTAINER, this.scatterItem, this);
        
        // Condición de Victoria
        events.on(EVENTS.ENVIRONMENT_RESTORED, this.checkWinCondition, this);
        
        // Limpieza de eventos al destruir la escena
        this.events.once('shutdown', () => {
            events.off(EVENTS.WRONG_CONTAINER, this.scatterItem, this);
            events.off(EVENTS.ENVIRONMENT_RESTORED, this.checkWinCondition, this);
        });
    }

    update() {
        this.player.update();
    }

    collectItem(playerSprite, item) {
        if (this.inventoryManager.addItem(item.getData('itemType'))) {
            item.destroy(); // Se elimina de la escena
        }
    }

    recycleItems(playerSprite, container) {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            const containerType = container.getData('containerType');
            this.inventoryManager.recycle(containerType);
        }
    }

    checkWinCondition(data) {
        if (data.percentage >= 100) {
            // Obtener el puntaje final desde la UI
            const uiScene = this.scene.get('UIScene');
            const finalScore = uiScene ? uiScene.score : 0;
            
            // Pausa sutil antes de saltar a la victoria
            this.time.delayedCall(1500, () => {
                this.scene.stop('UIScene'); // Detener el HUD
                this.scene.start('WinScene', { score: finalScore });
            });
        }
    }

    scatterItem(data) {
        // Generar nuevas coordenadas aleatorias dentro del mapa de 1600x1600
        const x = Phaser.Math.Between(50, 1550);
        const y = Phaser.Math.Between(50, 1550);
        
        // Re-crear el item en el mapa para que pueda ser recogido nuevamente
        ItemFactory.spawnSingleItem(this.itemsGroup, x, y, data.item);
    }
}
