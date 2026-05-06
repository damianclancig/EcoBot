import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fondo oscuro
        this.cameras.main.setBackgroundColor('#1a1a1a');

        // Título Principal
        const titleText = this.add.text(width / 2, height * 0.25, 'EcoBot', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '72px',
            fontStyle: 'bold',
            fill: '#4caf50',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Instrucciones de Juego
        const instructions = 
            "¡Ayuda a EcoBot a limpiar la ciudad!\n" +
            "Recoge la basura dispersa y clasifícala\n" +
            "en los contenedores correctos.\n\n" +
            "Controles:\n" +
            "Flechas (⬆️ ⬇️ ⬅️ ➡️) : Moverse\n" +
            "BARRA ESPACIADORA : Depositar basura en contenedor";

        const instText = this.add.text(width / 2, height * 0.55, instructions, {
            fontFamily: 'Inter, sans-serif',
            fontSize: '22px',
            fill: '#e0e0e0',
            align: 'center',
            lineSpacing: 8,
            wordWrap: { width: width * 0.9 }
        }).setOrigin(0.5);
        
        // Escala inicial si inicia en mobile
        const initialScale = width < 500 ? width / 500 : 1;
        titleText.setScale(initialScale);
        instText.setScale(initialScale);
        
        // Botón JUGAR
        const playBtn = this.add.rectangle(width / 2, height * 0.85, 220, 60, 0x2196f3, 1)
            .setInteractive({ useHandCursor: true });
            
        const playText = this.add.text(width / 2, height * 0.85, 'JUGAR', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '28px',
            fontStyle: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Interacción Visual del Botón (Hover)
        playBtn.on('pointerover', () => {
            playBtn.setFillStyle(0x1976d2);
            this.tweens.add({
                targets: [playBtn, playText],
                scale: 1.05,
                duration: 100
            });
        });

        playBtn.on('pointerout', () => {
            playBtn.setFillStyle(0x2196f3);
            this.tweens.add({
                targets: [playBtn, playText],
                scale: 1,
                duration: 100
            });
        });

        // Evento Click
        playBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // --- RESPONSIVE RESIZE ---
        this.scale.on('resize', (gameSize) => {
            const newWidth = gameSize.width;
            const newHeight = gameSize.height;

            titleText.setPosition(newWidth / 2, newHeight * 0.25);
            
            instText.setPosition(newWidth / 2, newHeight * 0.55);
            instText.setStyle({ wordWrap: { width: newWidth * 0.9 } });
            
            playBtn.setPosition(newWidth / 2, newHeight * 0.85);
            playText.setPosition(newWidth / 2, newHeight * 0.85);
            
            // Escalar todo proporcionalmente si la pantalla es más angosta que 500px
            const scaleFactor = newWidth < 500 ? newWidth / 500 : 1;
            titleText.setScale(scaleFactor);
            instText.setScale(scaleFactor);
            playBtn.setScale(scaleFactor);
            playText.setScale(scaleFactor);
        });
    }
}
