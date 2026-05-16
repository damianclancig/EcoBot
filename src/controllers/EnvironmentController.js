import events, { EVENTS } from '../utils/Events.js';
import Phaser from 'phaser';

export default class EnvironmentController {
    /**
     * @param {Phaser.Scene} scene 
     * @param {Phaser.Physics.Arcade.Group} itemsGroup 
     * @param {Phaser.Tilemaps.TilemapLayer} mapLayer
     */
    constructor(scene, itemsGroup, mapLayer) {
        this.scene = scene;
        this.itemsGroup = itemsGroup;
        this.totalGarbage = itemsGroup.getChildren().length;
        this.mapLayer = mapLayer;
        this.recycledCount = 0;
        
        // Contabilizar total de tiles sucios (caminables y obstáculos)
        this.totalDirtyTiles = 0;
        this.mapLayer.forEachTile(t => {
            if ([0, 1, 2, 3, 4].includes(t.index)) {
                this.totalDirtyTiles++;
            }
        });
        
        events.on(EVENTS.CORRECT_RECYCLE, this.handleGlobalWaveClean, this);
    }

    handleGlobalWaveClean(data) {
        this.recycledCount += data.validItems;
        
        // El origen de la onda expansiva ahora es donde se recolectó originalmente el residuo
        const { x, y } = data.itemData;
        const centerTile = this.mapLayer.worldToTileXY(x, y);
        
        // Obtener ítems que aún están en el suelo
        const activeItems = this.itemsGroup.getChildren();
        const protectionRadius = 96; // Radio de protección en píxeles (aprox 1.5 tiles)

        // Recopilar todos los tiles que aún están sucios
        const dirtyTiles = [];
        this.mapLayer.forEachTile(t => {
            if ([0, 1, 2, 3, 4].includes(t.index)) {
                let isProtected = false;
                const tx = t.pixelX + 32; // Centro del tile en X
                const ty = t.pixelY + 32; // Centro del tile en Y
                
                // Verificar si hay alguna basura cerca
                for (let i = 0; i < activeItems.length; i++) {
                    if (Phaser.Math.Distance.Between(tx, ty, activeItems[i].x, activeItems[i].y) <= protectionRadius) {
                        isProtected = true;
                        break;
                    }
                }
                
                dirtyTiles.push({
                    tile: t,
                    isProtected: isProtected
                });
            }
        });

        // Calcular cuántos tiles limpiar proporcionalmente
        const isLastItem = this.recycledCount >= this.totalGarbage;
        const tilesPerItem = this.totalDirtyTiles / this.totalGarbage;
        const tilesToCleanCount = isLastItem ? dirtyTiles.length : Math.ceil(tilesPerItem * data.validItems);

        // Ordenar los tiles sucios
        dirtyTiles.sort((a, b) => {
            // 1. Penalización masiva: Los protegidos van al final de la cola
            if (a.isProtected && !b.isProtected) return 1;
            if (!a.isProtected && b.isProtected) return -1;

            // 2. Si tienen el mismo estado de protección, ordenar por distancia al origen
            const distA = Phaser.Math.Distance.Between(centerTile.x, centerTile.y, a.tile.x, a.tile.y);
            const distB = Phaser.Math.Distance.Between(centerTile.x, centerTile.y, b.tile.x, b.tile.y);
            return distA - distB;
        });

        // Seleccionar estrictamente los 'N' tiles resultantes y mapear a su objeto tile real
        const tilesToClean = dirtyTiles.slice(0, tilesToCleanCount).map(dt => dt.tile);

        // Aplicar el efecto de onda sobre esos tiles
        tilesToClean.forEach(tile => {
            const dist = Phaser.Math.Distance.Between(centerTile.x, centerTile.y, tile.x, tile.y);
            this.scene.time.delayedCall(dist * 50, () => {
                this.mapLayer.putTileAt(tile.index + 5, tile.x, tile.y);
            });
        });
        
        const cleanPercentage = this.totalGarbage > 0 ? Math.min(this.recycledCount / this.totalGarbage, 1) : 1;
        events.emit(EVENTS.ENVIRONMENT_RESTORED, { percentage: cleanPercentage * 100 });
    }

    destroy() {
        events.off(EVENTS.CORRECT_RECYCLE, this.handleGlobalWaveClean, this);
    }
}
