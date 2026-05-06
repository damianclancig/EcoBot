import Phaser from 'phaser';

export default class WinScene extends Phaser.Scene {
    constructor() {
        super('WinScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.setBackgroundColor('#1b5e20'); // Verde victoria oscuro

        // Texto principal
        const titleText = this.add.text(width / 2, height * 0.3, '¡Misión Cumplida!', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '54px',
            fontStyle: 'bold',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            wordWrap: { width: width * 0.9 }
        }).setOrigin(0.5);

        // Subtítulo
        const subText = this.add.text(width / 2, height * 0.45, 'Has limpiado el 100% de la ciudad.\n¡El ecosistema está a salvo gracias a ti!', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '24px',
            fill: '#e8f5e9',
            align: 'center',
            lineSpacing: 10,
            wordWrap: { width: width * 0.9 }
        }).setOrigin(0.5);

        // Puntuación
        const scoreText = this.add.text(width / 2, height * 0.6, `Puntuación Final: ${this.finalScore}`, {
            fontFamily: 'Inter, sans-serif',
            fontSize: '32px',
            fontStyle: 'bold',
            fill: '#ffeb3b'
        }).setOrigin(0.5);

        // Botón Volver al Menú
        const menuBtn = this.add.rectangle(width / 2, height * 0.8, 300, 60, 0x1976d2, 1)
            .setInteractive({ useHandCursor: true });
            
        const menuText = this.add.text(width / 2, height * 0.8, 'VOLVER AL MENÚ', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Escala inicial
        const initialScale = width < 500 ? width / 500 : 1;
        titleText.setScale(initialScale);
        subText.setScale(initialScale);
        scoreText.setScale(initialScale);
        
        menuBtn.on('pointerover', () => {
            menuBtn.setFillStyle(0x1565c0);
            this.tweens.add({ targets: [menuBtn, menuText], scale: 1.05, duration: 100 });
        });

        menuBtn.on('pointerout', () => {
            menuBtn.setFillStyle(0x1976d2);
            this.tweens.add({ targets: [menuBtn, menuText], scale: 1, duration: 100 });
        });

        menuBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        
        // Celebración de Confeti simulada
        for (let i = 0; i < 60; i++) {
            const confetti = this.add.rectangle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(-height, 0),
                8, 12,
                Phaser.Utils.Array.GetRandom([0xffeb3b, 0x4caf50, 0x2196f3, 0xf44336, 0xe040fb])
            );
            
            this.tweens.add({
                targets: confetti,
                y: height + 50,
                x: confetti.x + Phaser.Math.Between(-100, 100),
                rotation: Math.PI * 4,
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                ease: 'Sine.inOut'
            });
        }
        
        // --- RESPONSIVE RESIZE ---
        this.scale.on('resize', (gameSize) => {
            const newWidth = gameSize.width;
            const newHeight = gameSize.height;

            titleText.setPosition(newWidth / 2, newHeight * 0.3);
            titleText.setStyle({ wordWrap: { width: newWidth * 0.9 } });
            
            subText.setPosition(newWidth / 2, newHeight * 0.45);
            subText.setStyle({ wordWrap: { width: newWidth * 0.9 } });
            
            scoreText.setPosition(newWidth / 2, newHeight * 0.6);
            menuBtn.setPosition(newWidth / 2, newHeight * 0.8);
            menuText.setPosition(newWidth / 2, newHeight * 0.8);
            
            const scaleFactor = newWidth < 500 ? newWidth / 500 : 1;
            titleText.setScale(scaleFactor);
            subText.setScale(scaleFactor);
            scoreText.setScale(scaleFactor);
            menuBtn.setScale(scaleFactor);
            menuText.setScale(scaleFactor);
        });
    }
}
