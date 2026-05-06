import events, { EVENTS } from '../utils/Events.js';

export default class EnvironmentController {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} totalGarbage 
     * @param {Phaser.Tilemaps.TilemapLayer} capaSucia
     */
    constructor(scene, totalGarbage, capaSucia) {
        this.scene = scene;
        this.totalGarbage = totalGarbage;
        this.capaSucia = capaSucia;
        this.recycledCount = 0;
        
        // Capa oscura (Smog) - muy grande para cubrir pantallas panorámicas
        this.smog = scene.add.rectangle(0, 0, 3000, 3000, 0x2a2a2a, 0.7)
            .setOrigin(0, 0).setScrollFactor(0).setDepth(100); // Frente a todo

        events.on(EVENTS.ITEMS_RECYCLED, this.handleRecycled, this);
    }

    handleRecycled(data) {
        this.recycledCount += data.validItems;
        
        const cleanPercentage = this.totalGarbage > 0 ? Math.min(this.recycledCount / this.totalGarbage, 1) : 1;
        
        // Interpolación del Smog y la Capa Sucia
        const newAlpha = 0.7 - (cleanPercentage * 0.7);
        const mapAlpha = 1 - cleanPercentage;
        
        this.scene.tweens.add({
            targets: [this.smog],
            fillAlpha: newAlpha,
            duration: 1000,
            ease: 'Power2'
        });

        if (this.capaSucia) {
            this.scene.tweens.add({
                targets: this.capaSucia,
                alpha: mapAlpha,
                duration: 1000,
                ease: 'Power2'
            });
        }

        // Evento global para notificar porcentaje
        events.emit(EVENTS.ENVIRONMENT_RESTORED, { percentage: cleanPercentage * 100 });
    }

    destroy() {
        events.off(EVENTS.ITEMS_RECYCLED, this.handleRecycled, this);
    }
}
