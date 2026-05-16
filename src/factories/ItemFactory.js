import Phaser from 'phaser';

const trashFrames = [
    'ecoBot-blue-box.png', 'ecoBot-blue-newspaper-1.png', 'ecoBot-blue-newspaper-2.png',
    'ecoBot-blue-newspaper-3.png', 'ecoBot-blue-newspaper-4.png', 'ecoBot-blue-papers.png',
    'ecoBot-brown-apple.png', 'ecoBot-brown-bread.png', 'ecoBot-brown-fish.png',
    'ecoBot-brown-food.png', 'ecoBot-brown-fruit.png', 'ecoBot-brown-gas.png',
    'ecoBot-green-glass.png',
    'ecoBot-red-batery.png', 'ecoBot-red-cell-1.png', 'ecoBot-red-cell-2.png',
    'ecoBot-red-cell-3.png', 'ecoBot-red-electric.png',
    'ecoBot-yellow-bottle.png', 'ecoBot-yellow-goma.png', 'ecoBot-yellow-lata-1.png',
    'ecoBot-yellow-lata-2.png', 'ecoBot-yellow-lata-3.png', 'ecoBot-yellow-tapa-1.png',
    'ecoBot-yellow-tapa-2.png'
];

export default class ItemFactory {
    static spawnSingleItem(group, x, y, frameName) {
        const item = group.create(x, y, 'ecoBot-objects', frameName);
        item.setBounceY(0);
        item.setData('itemType', frameName);
        
        // Scale to fit 64x64 tiles
        item.setDisplaySize(40, 40);
        
        if (item.body) {
            item.body.setSize(item.width, item.height);
            item.body.setOffset(0, 0); 
        }
        
        return item;
    }

    static createRandomItems(scene, mapLayer, count) {
        const group = scene.physics.add.group();
        this.scatterPenalty(scene, group, mapLayer, count, trashFrames);
        return group;
    }

    static scatterPenalty(scene, itemsGroup, mapLayer, count, itemsToScatter) {
        const pool = (itemsToScatter && itemsToScatter.length > 0) ? itemsToScatter : trashFrames;

        for (let i = 0; i < count; i++) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 200) {
                const x = Phaser.Math.Between(50, mapLayer.width - 50);
                const y = Phaser.Math.Between(50, mapLayer.height - 50);
                const tile = mapLayer.getTileAtWorldXY(x, y);
                
                if (tile && [0, 1, 2, 5, 6, 7].includes(tile.index)) {
                    const frameName = Phaser.Math.RND.pick(pool);
                    this.spawnSingleItem(itemsGroup, x, y, frameName);
                    placed = true;
                }
                attempts++;
            }
        }
    }
}
