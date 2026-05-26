// 007: Agent Protocol - A Spy Action Game

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: GameScene,
    parent: 'game-container',
    backgroundColor: '#1a1a1a'
};

const game = new Phaser.Game(config);



class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Game variables
        this.playerHealth = 100;
        this.score = 0;
        this.enemiesDefeated = 0;
        this.gameActive = true;

        // Create player as a visible game object
        this.player = this.add.rectangle(100, 400, 30, 40, 0x00ff00);
        this.player.setStrokeStyle(2, 0xffff00);
        this.physics.world.enable(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setBounce(0.1);
        this.player.health = this.playerHealth;

        // Create enemy and bullet groups
        this.enemies = this.physics.add.group();
        this.bulletGroup = this.physics.add.group();

        // Spawn initial enemies
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy();
        }

        // Set up collisions
        this.physics.add.collider(this.player, this.enemies, this.playerHit, null, this);
        this.physics.add.overlap(this.bulletGroup, this.enemies, this.bulletHitEnemy, null, this);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', () => this.shoot());
        this.input.keyboard.on('keydown-R', () => this.scene.restart());
        this.input.on('pointerdown', () => this.shoot());

        // Camera
        this.cameras.main.setBounds(0, 0, 1200, 800);
        this.cameras.main.startFollow(this.player);

        // UI
        this.healthText = this.add.text(20, 20, '', { font: '16px Courier', fill: '#00ff00' }).setScrollFactor(0);
        this.scoreText = this.add.text(20, 50, '', { font: '16px Courier', fill: '#00ff00' }).setScrollFactor(0);
        this.missionText = this.add.text(20, 80, '', { font: '16px Courier', fill: '#00ff00' }).setScrollFactor(0);

        this.updateUI();
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(600, 1100);
        const y = Phaser.Math.Between(100, 700);
        
        const enemy = this.add.rectangle(x, y, 30, 40, 0xff0000);
        enemy.setStrokeStyle(2, 0x660000);
        this.physics.world.enable(enemy);
        enemy.body.setCollideWorldBounds(true);
        enemy.body.setBounce(0.5);
        enemy.health = 30;
        enemy.speed = Phaser.Math.Between(80, 150);
        enemy.shootTimer = 0;
        
        this.enemies.add(enemy);
    }

    shoot() {
        if (!this.gameActive) return;

        const bullet = this.add.rectangle(this.player.x, this.player.y, 6, 16, 0xffff00);
        this.physics.world.enable(bullet);
        
        const angle = Phaser.Math.Angle.Between(
            this.player.x, 
            this.player.y, 
            this.input.activePointer.x + this.cameras.main.scrollX,
            this.input.activePointer.y + this.cameras.main.scrollY
        );
        
        const speed = 400;
        bullet.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        bullet.lifespan = 3000;
        bullet.angle = Phaser.Math.RadToDeg(angle);
        
        this.bulletGroup.add(bullet);
    }

    updateUI() {
        this.healthText.setText(`HEALTH: ${Math.max(0, this.playerHealth)}`);
        this.scoreText.setText(`SCORE: ${this.score} | TARGETS: ${this.enemiesDefeated}`);
        this.missionText.setText(`MISSION: Eliminate 5 enemies | Remaining: ${5 - this.enemiesDefeated}`);
    }

    playerHit(player, enemy) {
        if (!this.gameActive) return;
        
        this.playerHealth -= 10;
        this.updateUI();

        if (this.playerHealth <= 0) {
            this.endGame(false);
        }
    }

    bulletHitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.health -= 25;

        if (enemy.health <= 0) {
            this.score += 100;
            this.enemiesDefeated++;
            this.updateUI();
            enemy.destroy();

            if (this.enemiesDefeated >= 5) {
                this.endGame(true);
            }
        }
    }

    endGame(won) {
        this.gameActive = false;
        const message = won ? 'MISSION ACCOMPLISHED!' : 'MISSION FAILED!';
        const color = won ? '#00ff00' : '#ff0000';
        
        const gameOverText = this.add.text(
            600, 
            300, 
            message, 
            { font: 'bold 48px Courier', fill: color, align: 'center' }
        ).setOrigin(0.5).setScrollFactor(0);
        
        this.add.text(
            600, 
            380, 
            `Final Score: ${this.score}`, 
            { font: '32px Courier', fill: '#ffff00', align: 'center' }
        ).setOrigin(0.5).setScrollFactor(0);
        
        this.add.text(
            600, 
            450, 
            'Press R to restart or SPACE to try again', 
            { font: '16px Courier', fill: '#00ff00', align: 'center' }
        ).setOrigin(0.5).setScrollFactor(0);
    }

    update() {
        if (!this.gameActive) return;

        // Player movement
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-250);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(250);
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-250);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(250);
        }

        // Update bullets
        this.bulletGroup.children.entries.forEach(bullet => {
            bullet.lifespan -= 16;
            if (bullet.lifespan <= 0) {
                bullet.destroy();
            }
        });

        // Enemy AI
        this.enemies.children.entries.forEach(enemy => {
            const distToPlayer = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, 
                enemy.x, enemy.y
            );

            if (distToPlayer < 300) {
                // Chase player
                const angle = Phaser.Math.Angle.Between(
                    enemy.x, enemy.y, 
                    this.player.x, this.player.y
                );
                enemy.body.setVelocity(
                    Math.cos(angle) * enemy.speed,
                    Math.sin(angle) * enemy.speed
                );

                // Shoot randomly
                enemy.shootTimer++;
                if (enemy.shootTimer > 60) {
                    this.enemyShoot(enemy);
                    enemy.shootTimer = 0;
                }
            } else {
                // Patrol
                if (Math.random() > 0.98) {
                    const randomAngle = Math.random() * Math.PI * 2;
                    enemy.body.setVelocity(
                        Math.cos(randomAngle) * (enemy.speed * 0.5),
                        Math.sin(randomAngle) * (enemy.speed * 0.5)
                    );
                }
            }
        });
    }

    enemyShoot(enemy) {
        const bullet = this.add.rectangle(enemy.x, enemy.y, 6, 16, 0xff6600);
        this.physics.world.enable(bullet);
        
        const angle = Phaser.Math.Angle.Between(
            enemy.x, enemy.y, 
            this.player.x, this.player.y
        );
        
        bullet.body.setVelocity(
            Math.cos(angle) * 250,
            Math.sin(angle) * 250
        );
        
        bullet.lifespan = 3000;

        this.physics.add.overlap(bullet, this.player, () => {
            bullet.destroy();
            this.playerHit(this.player, enemy);
        });
    }
}
