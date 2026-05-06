import Phaser from 'phaser';

export default class ContainerFactory {
    /**
     * @param {Phaser.Scene} scene 
     * @param {Array<{x: number, y: number, type: string}>} containersData 
     * @returns {Phaser.Physics.Arcade.StaticGroup}
     */
    static createContainers(scene, containersData) {
        const group = scene.physics.add.staticGroup();

        containersData.forEach(data => {
            const container = group.create(data.x, data.y, `container_${data.type}`);
            container.setData('containerType', data.type);
            
            // Reducir tamaño visual al 50%
            container.setScale(0.5);
            
            // Obligatorio refrescar primero el cuerpo estático para que adopte la escala
            container.refreshBody(); 
            
            // El tamaño visual ahora es 24x32 (original era 48x64). 
            // Ajustamos el Hitbox a la mitad inferior del objeto escalado.
            container.body.setSize(24, 12);
            container.body.setOffset(12, 52);
        });

        return group;
    }
}
