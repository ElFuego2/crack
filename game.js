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
    backgroundColor: '#1a1a1a',
    render: {
        pixelArt: false,
        antialias: true
    }
};

const game = new Phaser.Game(config);



// MAIN GAME SCENE
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Game variables
        this.playerHealth = 100;
        this.score = 0;
        this.enemiesDefeated = 0;
        this.missionObjective = 'Eliminate 5 enemies';
        this.gameActive = true;

        // Create game objects container
        this.gameObjects = this.add.group();
        this.playerGraphics = null;
        this.enemyGraphics = [];

        // Create player as a simple rectangle
        this.player = this.physics.add.rectangle(100, 400, 30, 40, false);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.1);
        this.player.body.setMaxVelocity(300, 300);
        this.player.health = this.playerHealth;

        // Draw player
        this.drawPlayer();

        // Create groups
        this.enemies = this.physics.add.group();
        this.bullets = this.physics.add.group();

        // Spawn enemies
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(600, 1100);
            const y = Phaser.Math.Between(100, 700);
            this.spawnEnemy(x, y);
        }

        // Collisions
        this.physics.add.collider(this.player, this.enemies, this.playerHit, null, this);
        this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitEnemy, null, this);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', () => this.shoot());
        this.input.keyboard.on('keydown-R', () => this.scene.restart());

        // Camera
        this.cameras.main.setBounds(0, 0, 1200, 800);
        this.cameras.main.startFollow(this.player);

        // UI
        this.createUI();

        // Enemy spawn timer
        this.spawnTimer = 0;
    }

    drawPlayer() {
        if (this.playerGraphics) this.playerGraphics.destroy();
        
        const graphics = this.make.graphics({ x: this.player.x, y: this.player.y, add: true });
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(-15, -20, 30, 40);
        graphics.fillStyle(0xffff00, 1);
        graphics.fillRect(-8, -15, 16, 15);
        this.playerGraphics = graphics;
    }

    drawEnemy(x, y) {
        const graphics = this.make.graphics({ x: x, y: y, add: true });
        graphics.fillStyle(0xff0000, 1);
        graphics.fillRect(-15, -20, 30, 40);
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(-8, -15, 16, 15);
        return graphics;
    }

    createUI() {
        const style = {
            font: '16px Courier',
            fill: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        };

        this.healthText = this.add.text(20, 20, '', style).setScrollFactor(0).setDepth(100);
        this.scoreText = this.add.text(20, 50, '', style).setScrollFactor(0).setDepth(100);
        this.objectiveText = this.add.text(20, 80, '', style).setScrollFactor(0).setDepth(100);
        this.instructionsText = this.add.text(20, 110, 'ARROWS: Move | SPACE: Shoot | R: Restart', 
            { font: '12px Courier', fill: '#ffff00', backgroundColor: '#000000', padding: { x: 10, y: 5 } }).setScrollFactor(0).setDepth(100);

        this.updateUI();
    }

    updateUI() {
        this.healthText.setText(`HEALTH: ${Math.max(0, this.playerHealth)}`);
        this.scoreText.setText(`SCORE: ${this.score} | TARGETS: ${this.enemiesDefeated}`);
        this.objectiveText.setText(`MISSION: ${this.missionObjective}`);
    }

    playerHit(player, enemy) {
        if (!this.gameActive) return;
        this.playerHealth -= 10;
        player.health = this.playerHealth;
        this.updateUI();

        if (this.playerHealth <= 0) {
            this.gameActive = false;
            this.scene.start('GameOverScene', { score: this.score, won: false });
        }
    }

    bulletHitEnemy(bullet, enemy) {
        if (bullet.graphics) bullet.graphics.destroy();
        bullet.destroy();
        enemy.health -= 25;

        if (enemy.health <= 0) {
            this.score += 100;
            this.enemiesDefeated++;
            this.updateUI();
            if (enemy.graphics) enemy.graphics.destroy();
            enemy.destroy();

            // Check mission complete
            if (this.enemiesDefeated >= 5) {
                this.gameActive = false;
                this.scene.start('GameOverScene', { score: this.score, won: true });
            }
        }
    }

    update() {
        if (!this.gameActive) return;

        // Update player graphics position
        if (this.playerGraphics) {
            this.playerGraphics.x = this.player.x;
            this.playerGraphics.y = this.player.y;
        }

        // Player movement
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-250);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(250);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-250);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(250);
        }

        // Update bullets graphics
        this.bullets.children.entries.forEach(bullet => {
            if (bullet.graphics) {
                bullet.graphics.x = bullet.x;
                bullet.graphics.y = bullet.y;
            }
            bullet.lifespan -= 16;
            if (bullet.lifespan <= 0) {
                if (bullet.graphics) bullet.graphics.destroy();
                bullet.destroy();
            }
        });

        // Enemy AI
        this.enemies.children.entries.forEach(enemy => {
            // Update graphics position
            if (enemy.graphics) {
                enemy.graphics.x = enemy.x;
                enemy.graphics.y = enemy.y;
            }

            const distToPlayer = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, enemy.x, enemy.y
            );

            // Chase player if close
            if (distToPlayer < 300) {
                enemy.isChasing = true;
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                enemy.setVelocity(
                    Math.cos(angle) * enemy.speed,
                    Math.sin(angle) * enemy.speed
                );

                // Enemy shoot
                enemy.shootTimer++;
                if (enemy.shootTimer > 60) {
                    this.enemyShoot(enemy);
                    enemy.shootTimer = 0;
                }
            } else {
                enemy.isChasing = false;
                // Patrol
                if (Math.random() > 0.95) {
                    const randomAngle = Math.random() * Math.PI * 2;
                    enemy.setVelocity(
                        Math.cos(randomAngle) * (enemy.speed * 0.5),
                        Math.sin(randomAngle) * (enemy.speed * 0.5)
                    );
                }
            }
        });
    }

    enemyShoot(enemy) {
        const bullet = this.physics.add.rectangle(enemy.x, enemy.y, 6, 16, false);

        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
        this.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), 250, bullet.body.velocity);
        bullet.lifespan = 3000;
        bullet.isPlayerBullet = false;

        // Draw enemy bullet
        const graphics = this.make.graphics({ x: bullet.x, y: bullet.y, add: true });
        graphics.fillStyle(0xff6600, 1);
        graphics.fillRect(-3, -8, 6, 16);
        bullet.graphics = graphics;

        // Collision with player
        this.physics.add.overlap(bullet, this.player, () => {
            if (bullet.graphics) bullet.graphics.destroy();
            bullet.destroy();
            this.playerHit(this.player, enemy);
        });
    }
}

// GAME OVER SCENE
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score;
        this.won = data.won;
    }

    create() {
        const resultText = this.won ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED';
        const resultColor = this.won ? '#00ff00' : '#ff0000';

        this.add.text(600, 200, resultText, {
            font: '48px Courier',
            fill: resultColor,
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.add.text(600, 300, `FINAL SCORE: ${this.score}`, {
            font: '32px Courier',
            fill: '#ffff00',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        const instructions = this.won ? 
            'Press SPACE to play again' : 
            'Press SPACE to try again';

        this.add.text(600, 400, instructions, {
            font: '24px Courier',
            fill: '#00ff00',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}
