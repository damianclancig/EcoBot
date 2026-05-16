import events, { EVENTS } from '../utils/Events.js';

export default class PlayerController {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
    constructor(scene, x, y) {
        this.scene = scene;
        // Creamos un sprite para EcoBot usando el Texture Atlas y el frame inicial
        this.sprite = scene.physics.add.sprite(x, y, 'ecobot', 'ecoBot_idle.png');

        // Configurar animaciones si no existen
        if (!scene.anims.exists('ecobot_idle')) {
            scene.anims.create({
                key: 'ecobot_idle',
                frames: [{ key: 'ecobot', frame: 'ecoBot_idle.png' }],
                frameRate: 10
            });
            scene.anims.create({
                key: 'ecobot_move',
                frames: [
                    { key: 'ecobot', frame: 'ecoBot_idle.png' },
                    { key: 'ecobot', frame: 'ecoBot_mov_1.png' },
                    { key: 'ecobot', frame: 'ecoBot_mov_2.png' },
                    { key: 'ecobot', frame: 'ecoBot_mov_3.png' }
                ],
                frameRate: 8,
                repeat: -1
            });
            scene.anims.create({
                key: 'ecobot_ok',
                frames: [
                    { key: 'ecobot', frame: 'ecoBot_ok_1.png' },
                    { key: 'ecobot', frame: 'ecoBot_ok_2.png' }
                ],
                frameRate: 8,
                repeat: 3 // repite unas veces para celebrar
            });
            scene.anims.create({
                key: 'ecobot_err',
                frames: [
                    { key: 'ecobot', frame: 'ecoBot_err_1.png' },
                    { key: 'ecobot', frame: 'ecoBot_err_2.png' },
                    { key: 'ecobot', frame: 'ecoBot_err_3.png' },
                    { key: 'ecobot', frame: 'ecoBot_err_2.png' },
                    { key: 'ecobot', frame: 'ecoBot_err_3.png' },
                    { key: 'ecobot', frame: 'ecoBot_err_4.png' }
                ],
                frameRate: 8,
                repeat: 0
            });
        }

        this.sprite.play('ecobot_idle');

        // Escuchar cuando terminan las animaciones de acción
        this.isPlayingAction = false;
        this.sprite.on('animationcomplete', (anim) => {
            if (anim.key === 'ecobot_ok' || anim.key === 'ecobot_err') {
                this.isPlayingAction = false;
                // Restaurar la escala normal
                this.sprite.setScale(0.35);
            }
        });

        // El nuevo Atlas estandarizado tiene imágenes de 220x256 px. 
        // Lo reducimos al 35% (0.35) para que quepa en el mapa.
        this.sprite.setScale(0.35);

        // Renderizar por encima de la basura y contenedores
        this.sprite.setDepth(50);

        // Ajustamos la caja de colisión (sobre los píxeles originales 220x256)
        // Hitbox base: 85x57. Escala 0.35 => Hitbox real aprox 30x20.
        this.sprite.body.setSize(85, 57);
        // Centrado: (220-85)/2 = 68. Base: 256 - 57 = 199 (pegado a los pies)
        this.sprite.body.setOffset(68, 199);

        // Inputs
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Estado
        this.isOverweight = false;

        // Escuchar eventos
        events.on(EVENTS.INVENTORY_FULL, this.handleOverweight, this);
        events.on(EVENTS.INVENTORY_EMPTIED, this.handleNormalWeight, this);
        events.on(EVENTS.CORRECT_RECYCLE, this.playSuccessAnim, this);
        events.on(EVENTS.WRONG_CONTAINER, this.playErrorAnim, this);
    }

    playSuccessAnim() {
        this.isPlayingAction = true;
        this.sprite.anims.play('ecobot_ok', true);
    }

    playErrorAnim() {
        this.isPlayingAction = true;
        this.sprite.anims.play('ecobot_err', true);
        this.sprite.setScale(0.35 * 1.1);
    }

    update() {
        const speed = this.isOverweight ? 80 : 160;
        this.sprite.setVelocity(0);

        // Bloquear movimiento si está celebrando o lamentándose
        if (this.isPlayingAction) return;

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

        // Manejar animaciones basadas en la velocidad resultante
        if (this.sprite.body.velocity.x !== 0 || this.sprite.body.velocity.y !== 0) {
            this.sprite.anims.play('ecobot_move', true);
        } else {
            this.sprite.anims.play('ecobot_idle', true);
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
        events.off(EVENTS.CORRECT_RECYCLE, this.playSuccessAnim, this);
        events.off(EVENTS.WRONG_CONTAINER, this.playErrorAnim, this);
    }
}
