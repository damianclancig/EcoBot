import Phaser from 'phaser';

const containerFrames = [
    'ecoBot-container-blue.png', 
    'ecoBot-container-brown.png', 
    'ecoBot-container-green.png', 
    'ecoBot-container-red.png', 
    'ecoBot-container-yellow.png'
];

export default class ContainerFactory {
    static createContainers(scene, mapLayer) {
        const group = scene.physics.add.staticGroup();

        // Designated area: Top aisle (y = 1 tile => pixel Y = 96)
        // Positioned side-by-side with 128px spacing
        const startX = 256;
        const spacingX = 128;
        const y = 96;

        containerFrames.forEach((frameName, index) => {
            const x = startX + (index * spacingX);
            
            const container = group.create(x, y, 'ecoBot-objects', frameName);
            container.setData('containerType', frameName);
            
            container.setDisplaySize(64, 64);
            container.refreshBody(); 
            
            container.body.setSize(48, 48);
            container.body.setOffset(8, 16);
        });

        return group;
    }
}
