import events, { EVENTS } from '../utils/Events.js';

export default class PlayerController {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
    constructor(scene, x, y) {
        this.scene = scene;
        // Creamos un sprite para EcoBot, por ahora un rectángulo verde
        this.sprite = scene.physics.add.sprite(x, y, 'ecobot');
        
        // Físicas básicas y Hitbox ajustada para Top-Down
        this.sprite.setBounce(0);
        this.sprite.setCollideWorldBounds(true);
        
        // Aumentar el tamaño visual al 150% (25% anterior + 20% adicional)
        this.sprite.setScale(1.5);
        
        // Renderizar por encima de la basura y contenedores (Depth 50), pero por debajo del Smog (Depth 100)
        this.sprite.setDepth(50);
        
        // Ajustamos la caja de colisión a las "orugas" (base) del robot
        this.sprite.body.setSize(40, 24);
        this.sprite.body.setOffset(5, 40);

        // Inputs
        this.cursors = scene.input.keyboard.createCursorKeys();
        
        // Estado
        this.isOverweight = false;
        
        // Escuchar eventos
        events.on(EVENTS.INVENTORY_FULL, this.handleOverweight, this);
        events.on(EVENTS.INVENTORY_EMPTIED, this.handleNormalWeight, this);
    }

    update() {
        const speed = this.isOverweight ? 80 : 160;
        this.sprite.setVelocity(0);

        const uiScene = this.scene.scene.get('UIScene');
        const mInput = uiScene ? uiScene.mobileInputs : null;

        // Si el joystick se está usando (algún vector es distinto de 0)
        if (mInput && (mInput.vx !== 0 || mInput.vy !== 0)) {
            // Movimiento analógico completo (360 grados)
            this.sprite.setVelocityX(mInput.vx * speed);
            this.sprite.setVelocityY(mInput.vy * speed);
            
            // Dirección visual
            if (mInput.vx < -0.1) this.sprite.setFlipX(false);
            else if (mInput.vx > 0.1) this.sprite.setFlipX(true);
            
        } else {
            // Fallback a movimiento clásico por teclado (8 direcciones estáticas)
            if (this.cursors.left.isDown) {
                this.sprite.setVelocityX(-speed);
                this.sprite.setFlipX(false);
            } else if (this.cursors.right.isDown) {
                this.sprite.setVelocityX(speed);
                this.sprite.setFlipX(true);
            }

            if (this.cursors.up.isDown) {
                this.sprite.setVelocityY(-speed);
            } else if (this.cursors.down.isDown) {
                this.sprite.setVelocityY(speed);
            }
        }
    }

    handleOverweight() {
        this.isOverweight = true;
        this.sprite.setTint(0xffaa00); // Visual feedback de peso
    }

    handleNormalWeight() {
        this.isOverweight = false;
        this.sprite.clearTint();
    }
    
    destroy() {
        events.off(EVENTS.INVENTORY_FULL, this.handleOverweight, this);
        events.off(EVENTS.INVENTORY_EMPTIED, this.handleNormalWeight, this);
    }
}
