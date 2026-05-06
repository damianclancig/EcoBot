import Phaser from 'phaser';
import events, { EVENTS } from '../utils/Events.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: false });
        this.score = 0;
        this.inventoryCount = 0;
        this.maxInventory = 5;
    }

    create() {
        // UI Minimalista / Modo Oscuro
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.8);
        graphics.fillRect(0, 0, 800, 60);

        const textStyle = { 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '18px', 
            fill: '#ffffff',
            fontWeight: 'bold'
        };

        this.scoreText = this.add.text(20, 20, 'Puntos: 0', textStyle);
        this.inventoryText = this.add.text(250, 20, `Inventario: 0/${this.maxInventory}`, textStyle);
        this.environmentText = this.add.text(500, 20, 'Contaminación: 100%', textStyle);
        this.feedbackText = this.add.text(400, 100, '', { ...textStyle, fill: '#ff5555', fontSize: '24px' }).setOrigin(0.5);

        this.inventoryIcons = []; // Array para guardar los sprites visuales
        
        // Escuchar eventos
        events.on(EVENTS.ITEM_COLLECTED, this.updateInventory, this);
        events.on(EVENTS.INVENTORY_EMPTIED, this.updateInventory, this); // Reutilizamos este para actualizaciones generales de inventario
        events.on(EVENTS.SCORE_UPDATED, this.updateScore, this);
        events.on(EVENTS.ENVIRONMENT_RESTORED, this.updateEnvironment, this);
        events.on(EVENTS.WRONG_CONTAINER, this.showWarning, this);
        events.on(EVENTS.INVENTORY_FULL, this.showFullWarning, this);
    }

    updateInventory(data) {
        this.inventoryCount = data.items.length;
        this.inventoryText.setText(`Inventario: ${this.inventoryCount}/${this.maxInventory}`);

        // Limpiar iconos anteriores
        this.inventoryIcons.forEach(icon => icon.destroy());
        this.inventoryIcons = [];

        const startX = 40;
        const startY = 100;
        const slotSize = 46;
        const padding = 10;

        // Dibujar Cuadrícula/Slots (visual de fondo) solo una vez
        if (!this.slotsDrawn) {
            this.slotsDrawn = true;
            this.slotGraphics = this.add.graphics();
            this.slotGraphics.lineStyle(2, 0x444444, 1);
            this.slotGraphics.fillStyle(0x222222, 0.8);
            for(let i = 0; i < this.maxInventory; i++) {
                this.slotGraphics.fillRect(startX + i * (slotSize + padding), startY, slotSize, slotSize);
                this.slotGraphics.strokeRect(startX + i * (slotSize + padding), startY, slotSize, slotSize);
            }
        }
        
        data.items.forEach((itemType, index) => {
            // Posicionar en el centro del slot correspondiente
            const x = startX + index * (slotSize + padding) + (slotSize / 2);
            const y = startY + (slotSize / 2);
            const icon = this.add.image(x, y, itemType);
            
            // Ajustar forzadamente el tamaño visual a 36x36 px para que encaje perfecto en el slot de 46x46
            icon.setDisplaySize(36, 36);
            
            // Destacar el elemento al frente de la cola (FIFO - el que se soltará primero)
            if (index === 0) {
                icon.setAlpha(1);
                // Breve tween para destacar el elemento listo para salir
                this.tweens.add({
                    targets: icon,
                    displayWidth: 42,
                    displayHeight: 42,
                    yoyo: true,
                    duration: 250,
                    ease: 'Sine.easeInOut'
                });
            } else {
                icon.setAlpha(0.5); // Los elementos haciendo fila
            }
            
            this.inventoryIcons.push(icon);
        });
    }

    updateScore(data) {
        this.score += data.delta;
        this.scoreText.setText(`Puntos: ${this.score}`);
    }

    updateEnvironment(data) {
        const remainingContamination = Math.max(0, 100 - data.percentage).toFixed(0);
        this.environmentText.setText(`Contaminación: ${remainingContamination}%`);
    }

    showWarning(data) {
        this.showTransientMessage('¡Contenedor incorrecto! Penalización de puntos.');
    }

    showFullWarning() {
        this.showTransientMessage('¡Inventario Lleno! Velocidad reducida.', '#ffaa00');
    }

    showTransientMessage(msg, color = '#ff5555') {
        this.feedbackText.setText(msg);
        this.feedbackText.setColor(color);
        this.feedbackText.setAlpha(1);

        this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
        });
    }
}
