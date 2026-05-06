import Phaser from 'phaser';
import events, { EVENTS } from '../utils/Events.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: false });
        this.score = 0;
        this.inventoryCount = 0;
        this.maxInventory = 5;
        this.mobileInputs = { up: false, down: false, left: false, right: false, vx: 0, vy: 0 };
    }

    create() {
        // Panel Vertical Derecho (Fondo)
        this.infoPanelBg = this.add.graphics();

        const textStyle = { 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '14px', 
            fill: '#ffffff',
            fontWeight: 'bold',
            align: 'right'
        };

        this.scoreText = this.add.text(0, 0, 'Puntos: 0', textStyle).setOrigin(1, 0);
        this.inventoryText = this.add.text(0, 0, `Inventario: 0/${this.maxInventory}`, textStyle).setOrigin(1, 0);
        this.environmentText = this.add.text(0, 0, 'Contaminación: 100%', textStyle).setOrigin(1, 0);
        this.feedbackText = this.add.text(0, 0, '', { ...textStyle, fill: '#ff5555', fontSize: '18px', align: 'center' }).setOrigin(0.5, 0);

        this.inventoryIcons = []; // Array para guardar los sprites visuales
        
        // Escuchar eventos
        events.on(EVENTS.ITEM_COLLECTED, this.updateInventory, this);
        events.on(EVENTS.INVENTORY_EMPTIED, this.updateInventory, this); // Reutilizamos este para actualizaciones generales de inventario
        events.on(EVENTS.SCORE_UPDATED, this.updateScore, this);
        events.on(EVENTS.ENVIRONMENT_RESTORED, this.updateEnvironment, this);
        events.on(EVENTS.WRONG_CONTAINER, this.showWarning, this);
        events.on(EVENTS.INVENTORY_FULL, this.showFullWarning, this);

        // Controles táctiles
        if (this.sys.game.device.os.android || this.sys.game.device.os.iOS || true) { // Temporalmente forzado para probar en Desktop
            this.createVirtualControls();
        }
    }

    createVirtualControls() {
        const height = this.cameras.main.height;
        const width = this.cameras.main.width;
        
        // --- JOYSTICK ANALÓGICO (Izquierda) ---
        let joyX = 120;
        let joyY = height - 120;
        const maxRadius = 60; // Límite de arrastre

        this.joyBase = this.add.circle(joyX, joyY, maxRadius, 0x4caf50, 0.2);
        this.joyThumb = this.add.circle(joyX, joyY, 35, 0x4caf50, 0.8).setInteractive();

        // Zona interactiva invisible que cubre la mitad izquierda
        const joyZone = this.add.zone(0, 0, width / 2, height).setOrigin(0, 0).setInteractive();
        
        let isDragging = false;
        let pointerId = null;

        const resetJoystick = () => {
            isDragging = false;
            pointerId = null;
            this.joyThumb.setPosition(joyX, joyY);
            this.mobileInputs.vx = 0;
            this.mobileInputs.vy = 0;
        };

        const updateJoystick = (pointer) => {
            let dx = pointer.x - joyX;
            let dy = pointer.y - joyY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > maxRadius) {
                const angle = Math.atan2(dy, dx);
                dx = Math.cos(angle) * maxRadius;
                dy = Math.sin(angle) * maxRadius;
            }
            
            this.joyThumb.setPosition(joyX + dx, joyY + dy);
            this.mobileInputs.vx = dx / maxRadius;
            this.mobileInputs.vy = dy / maxRadius;
        };

        joyZone.on('pointerdown', (pointer) => {
            isDragging = true;
            pointerId = pointer.id;
            updateJoystick(pointer);
        });

        joyZone.on('pointermove', (pointer) => {
            if (isDragging && pointer.id === pointerId) updateJoystick(pointer);
        });

        joyZone.on('pointerup', (pointer) => { if (pointer.id === pointerId) resetJoystick(); });
        joyZone.on('pointerout', (pointer) => { if (pointer.id === pointerId) resetJoystick(); });

        // --- BOTÓN ACCIÓN (Derecha) ---
        this.actionBtn = this.add.circle(width - 100, height - 100, 50, 0x2196f3, 0.6).setInteractive();
        this.actionText = this.add.text(width - 100, height - 100, 'RECICLAR', { fontSize: '16px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        this.actionBtn.on('pointerdown', () => { 
            this.actionBtn.setAlpha(1);
            events.emit(EVENTS.MOBILE_ACTION); 
        });
        this.actionBtn.on('pointerup', () => this.actionBtn.setAlpha(0.6));
        this.actionBtn.on('pointerout', () => this.actionBtn.setAlpha(0.6));
        
        // --- RESPONSIVE RESIZE ---
        const handleResize = (gameSize) => {
            const newWidth = gameSize.width;
            const newHeight = gameSize.height;

            // Reposicionar Joystick
            joyX = 120;
            joyY = newHeight - 120;
            this.joyBase.setPosition(joyX, joyY);
            if (!isDragging) this.joyThumb.setPosition(joyX, joyY);
            joyZone.setSize(newWidth / 2, newHeight);

            // Reposicionar Botón de Acción
            this.actionBtn.setPosition(newWidth - 100, newHeight - 100);
            this.actionText.setPosition(newWidth - 100, newHeight - 100);
            
            // Reposicionar Panel Derecho
            const panelWidth = 190;
            const panelHeight = 80;
            const panelX = newWidth - panelWidth - 10;
            const panelY = 10;

            this.infoPanelBg.clear();
            this.infoPanelBg.fillStyle(0x000000, 0.5); // Semitransparente
            this.infoPanelBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 8);
            
            this.scoreText.setPosition(newWidth - 20, panelY + 10);
            this.inventoryText.setPosition(newWidth - 20, panelY + 30);
            this.environmentText.setPosition(newWidth - 20, panelY + 50);
            
            // Feedback text flotante en el centro superior
            this.feedbackText.setPosition(newWidth / 2, 80);
        };

        this.scale.on('resize', handleResize);
        
        // Forzar el primer pintado del panel de forma segura
        handleResize(this.scale.gameSize);
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
