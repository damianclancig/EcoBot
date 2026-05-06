import Phaser from 'phaser';

export default class ItemFactory {
    /**
     * @param {Phaser.Scene} scene 
     * @param {Array<{x: number, y: number, type: string}>} itemsData 
     * @returns {Phaser.Physics.Arcade.Group}
     */
    static spawnSingleItem(group, x, y, type) {
        const item = group.create(x, y, type);
        item.setBounceY(0);
        item.setData('itemType', type);
        
        // Reducir tamaño visual a la mitad (50%)
        item.setScale(0.5);
        
        // Ajustar el tamaño del hitbox a 16x16 (ya que la textura es de 32x32)
        item.body.setSize(32, 32);
        
        return item;
    }

    static createItems(scene, itemsData) {
        const group = scene.physics.add.group();

        itemsData.forEach(data => {
            this.spawnSingleItem(group, data.x, data.y, data.type);
        });

        return group;
    }
}
