// 007: First Light - Extended Version
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const game = {
    width: 1200,
    height: 800,
    gameActive: true,
    wave: 1,
    waveEnemiesSpawned: 0,
    waveEnemiesKilled: 0,
    enemiesPerWave: 3,
    
    player: {
        x: 100,
        y: 400,
        width: 30,
        height: 40,
        vx: 0,
        vy: 0,
        speed: 5,
        health: 100,
        maxHealth: 100,
        ammo: 100,
        maxAmmo: 100,
        shield: 0,
        shieldMax: 30,
        rapidFire: 0,
        comboKills: 0
    },
    
    enemies: [],
    bullets: [],
    enemyBullets: [],
    powerups: [],
    grenades: [],
    explosions: [],
    
    score: 0,
    targetsEliminated: 0,
    multiplier: 1,
    keys: {},
    mouseX: 0,
    mouseY: 0
};

// Enemy types
const ENEMY_TYPES = {
    WEAK: { health: 20, speed: 1.2, size: 25, color: '#ff6666', reward: 50 },
    MEDIUM: { health: 35, speed: 2, size: 30, color: '#ff0000', reward: 100 },
    STRONG: { health: 60, speed: 1.5, size: 35, color: '#cc0000', reward: 200 },
    BOSS: { health: 150, speed: 1, size: 45, color: '#990000', reward: 500 }
};

// Input handling
window.addEventListener('keydown', (e) => {
    game.keys[e.key] = true;
    if (e.key === 'r' || e.key === 'R') location.reload();
    if (e.key === 'q' || e.key === 'Q') throwGrenade();
    if (e.key === 'e' || e.key === 'E') activateShield();
});

window.addEventListener('keyup', (e) => {
    game.keys[e.key] = false;
});

window.addEventListener('click', (e) => {
    if (!game.gameActive) return;
    const rect = canvas.getBoundingClientRect();
    playerShoot(e.clientX - rect.left, e.clientY - rect.top);
});

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    game.mouseX = e.clientX - rect.left;
    game.mouseY = e.clientY - rect.top;
});

window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && game.gameActive) {
        e.preventDefault();
        playerShoot(game.mouseX || game.player.x + 100, game.mouseY || game.player.y);
    }
});

// Player shooting
function playerShoot(targetX, targetY) {
    if (!game.gameActive || game.player.ammo <= 0) return;
    
    const dx = targetX - game.player.x;
    const dy = targetY - game.player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0) return;
    
    game.player.ammo -= 1;
    
    game.bullets.push({
        x: game.player.x,
        y: game.player.y,
        vx: (dx / dist) * 7,
        vy: (dy / dist) * 7,
        width: 6,
        height: 16,
        life: 200,
        damage: 25
    });
}

// Throw grenade
function throwGrenade() {
    if (!game.gameActive || game.player.ammo < 20) return;
    
    game.player.ammo -= 20;
    
    const angle = Math.atan2(game.mouseY - game.player.y, game.mouseX - game.player.x);
    game.grenades.push({
        x: game.player.x,
        y: game.player.y,
        vx: Math.cos(angle) * 5,
        vy: Math.sin(angle) * 5,
        life: 120,
        radius: 80,
        damage: 50
    });
}

// Activate shield
function activateShield() {
    if (game.player.shield <= 0) {
        game.player.shield = game.player.shieldMax;
    }
}

// Spawn enemy
function spawnEnemy(type = 'MEDIUM') {
    const typeData = ENEMY_TYPES[type];
    game.enemies.push({
        x: Math.random() * (game.width - 100) + 50,
        y: Math.random() * (game.height - 100) + 50,
        width: typeData.size,
        height: typeData.size,
        vx: 0,
        vy: 0,
        speed: typeData.speed,
        health: typeData.health,
        maxHealth: typeData.health,
        shootTimer: 0,
        detectionRange: 350,
        type: type,
        color: typeData.color,
        reward: typeData.reward
    });
}

// Enemy shooting
function enemyShoot(enemy) {
    const dx = game.player.x - enemy.x;
    const dy = game.player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0) return;
    
    game.enemyBullets.push({
        x: enemy.x,
        y: enemy.y,
        vx: (dx / dist) * 5,
        vy: (dy / dist) * 5,
        width: 6,
        height: 16,
        life: 200,
        damage: 10
    });
}

// Spawn power-ups
function spawnPowerup(x, y, type) {
    game.powerups.push({ x, y, type, life: 300 });
}

// Collision detection
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// Update game
function update() {
    if (!game.gameActive) return;
    
    // Check wave completion
    if (game.waveEnemiesKilled >= game.waveEnemiesSpawned && game.enemies.length === 0 && game.waveEnemiesSpawned > 0) {
        nextWave();
    }
    
    // Player movement
    game.player.vx = 0;
    game.player.vy = 0;
    
    if (game.keys['ArrowLeft'] || game.keys['a'] || game.keys['A']) game.player.vx = -game.player.speed;
    if (game.keys['ArrowRight'] || game.keys['d'] || game.keys['D']) game.player.vx = game.player.speed;
    if (game.keys['ArrowUp'] || game.keys['w'] || game.keys['W']) game.player.vy = -game.player.speed;
    if (game.keys['ArrowDown'] || game.keys['s'] || game.keys['S']) game.player.vy = game.player.speed;
    
    game.player.x += game.player.vx;
    game.player.y += game.player.vy;
    
    game.player.x = Math.max(0, Math.min(game.width - game.player.width, game.player.x));
    game.player.y = Math.max(0, Math.min(game.height - game.player.height, game.player.y));
    
    // Regenerate ammo
    if (game.player.ammo < game.player.maxAmmo) {
        game.player.ammo += 0.3;
    }
    
    // Shield decay
    if (game.player.shield > 0) {
        game.player.shield -= 0.2;
    }
    
    // Rapid fire decay
    if (game.player.rapidFire > 0) {
        game.player.rapidFire -= 1;
    }
    
    // Update player bullets
    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        bullet.life--;
        
        if (bullet.life <= 0 || bullet.x < 0 || bullet.x > game.width || bullet.y < 0 || bullet.y > game.height) {
            game.bullets.splice(i, 1);
            continue;
        }
        
        // Check collision with enemies
        for (let j = game.enemies.length - 1; j >= 0; j--) {
            const enemy = game.enemies[j];
            if (checkCollision(bullet.x, bullet.y, bullet.width, bullet.height, 
                              enemy.x, enemy.y, enemy.width, enemy.height)) {
                enemy.health -= bullet.damage;
                game.bullets.splice(i, 1);
                
                if (enemy.health <= 0) {
                    game.enemies.splice(j, 1);
                    game.score += enemy.reward * game.multiplier;
                    game.waveEnemiesKilled++;
                    game.player.comboKills++;
                    
                    // Increase multiplier on combos
                    game.multiplier = 1 + (game.player.comboKills * 0.1);
                    
                    // Random powerup drop
                    if (Math.random() < 0.3) {
                        const types = ['health', 'ammo', 'rapidfire'];
                        spawnPowerup(enemy.x, enemy.y, types[Math.floor(Math.random() * types.length)]);
                    }
                }
                break;
            }
        }
    }
    
    // Update grenades
    for (let i = game.grenades.length - 1; i >= 0; i--) {
        const grenade = game.grenades[i];
        grenade.x += grenade.vx;
        grenade.y += grenade.vy;
        grenade.life--;
        grenade.vy += 0.2; // gravity
        
        if (grenade.life <= 0) {
            // Explosion
            game.explosions.push({
                x: grenade.x,
                y: grenade.y,
                radius: grenade.radius,
                life: 20
            });
            
            // Damage enemies
            for (let j = game.enemies.length - 1; j >= 0; j--) {
                const enemy = game.enemies[j];
                const dist = Math.hypot(enemy.x - grenade.x, enemy.y - grenade.y);
                if (dist < grenade.radius) {
                    enemy.health -= grenade.damage;
                    if (enemy.health <= 0) {
                        game.enemies.splice(j, 1);
                        game.score += enemy.reward * game.multiplier;
                        game.waveEnemiesKilled++;
                        game.player.comboKills++;
                        game.multiplier = 1 + (game.player.comboKills * 0.1);
                    }
                }
            }
            
            game.grenades.splice(i, 1);
        }
    }
    
    // Update explosions
    for (let i = game.explosions.length - 1; i >= 0; i--) {
        game.explosions[i].life--;
        if (game.explosions[i].life <= 0) {
            game.explosions.splice(i, 1);
        }
    }
    
    // Update enemy bullets
    for (let i = game.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = game.enemyBullets[i];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        bullet.life--;
        
        if (bullet.life <= 0 || bullet.x < 0 || bullet.x > game.width || bullet.y < 0 || bullet.y > game.height) {
            game.enemyBullets.splice(i, 1);
            continue;
        }
        
        // Check collision with player
        if (checkCollision(bullet.x, bullet.y, bullet.width, bullet.height,
                          game.player.x, game.player.y, game.player.width, game.player.height)) {
            
            let damage = bullet.damage;
            if (game.player.shield > 0) {
                game.player.shield -= damage;
                if (game.player.shield < 0) {
                    damage = -game.player.shield;
                    game.player.shield = 0;
                }
                game.enemyBullets.splice(i, 1);
            } else {
                game.player.health -= damage;
                game.enemyBullets.splice(i, 1);
                
                if (game.player.health <= 0) {
                    game.gameActive = false;
                    document.getElementById('status').textContent = `✗ MISSION FAILED! Wave ${game.wave} | Final Score: ${Math.floor(game.score)}`;
                    document.getElementById('status').style.color = '#ff0000';
                }
            }
        }
    }
    
    // Update powerups
    for (let i = game.powerups.length - 1; i >= 0; i--) {
        const powerup = game.powerups[i];
        powerup.life--;
        
        if (powerup.life <= 0) {
            game.powerups.splice(i, 1);
            continue;
        }
        
        // Check collision with player
        if (checkCollision(game.player.x, game.player.y, game.player.width, game.player.height,
                          powerup.x - 10, powerup.y - 10, 20, 20)) {
            if (powerup.type === 'health') {
                game.player.health = Math.min(game.player.health + 50, game.player.maxHealth);
            } else if (powerup.type === 'ammo') {
                game.player.ammo = Math.min(game.player.ammo + 50, game.player.maxAmmo);
            } else if (powerup.type === 'rapidfire') {
                game.player.rapidFire = 180;
            }
            game.powerups.splice(i, 1);
        }
    }
    
    // Update enemies
    for (let i = 0; i < game.enemies.length; i++) {
        const enemy = game.enemies[i];
        
        const dx = game.player.x - enemy.x;
        const dy = game.player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < enemy.detectionRange) {
            enemy.vx = (dx / dist) * enemy.speed;
            enemy.vy = (dy / dist) * enemy.speed;
            
            enemy.shootTimer++;
            const shootRate = enemy.type === 'BOSS' ? 20 : enemy.type === 'STRONG' ? 35 : 45;
            if (enemy.shootTimer > shootRate) {
                enemyShoot(enemy);
                enemy.shootTimer = 0;
            }
        } else {
            enemy.vx = 0;
            enemy.vy = 0;
        }
        
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;
        
        enemy.x = Math.max(0, Math.min(game.width - enemy.width, enemy.x));
        enemy.y = Math.max(0, Math.min(game.height - enemy.height, enemy.y));
        
        // Check collision with player
        if (checkCollision(game.player.x, game.player.y, game.player.width, game.player.height,
                          enemy.x, enemy.y, enemy.width, enemy.height)) {
            let damage = 5;
            if (game.player.shield > 0) {
                game.player.shield -= damage;
            } else {
                game.player.health -= damage;
                if (game.player.health <= 0) {
                    game.gameActive = false;
                    document.getElementById('status').textContent = `✗ MISSION FAILED! Wave ${game.wave}`;
                    document.getElementById('status').style.color = '#ff0000';
                }
            }
        }
    }
    
    // Reset combo if no kills for a while
    game.player.comboKills = Math.max(0, game.player.comboKills - 0.01);
    
    // Update UI
    document.getElementById('health').textContent = `HEALTH: ${Math.max(0, Math.floor(game.player.health))}`;
    document.getElementById('score').textContent = `SCORE: ${Math.floor(game.score)} | Wave: ${game.wave} | x${game.multiplier.toFixed(1)}`;
    document.getElementById('targets').textContent = `AMMO: ${Math.floor(game.player.ammo)}/${game.player.maxAmmo} | SHIELD: ${Math.max(0, Math.floor(game.player.shield))}`;
}

// Next wave
function nextWave() {
    game.wave++;
    game.waveEnemiesKilled = 0;
    game.waveEnemiesSpawned = 0;
    game.player.comboKills = 0;
    game.multiplier = 1;
    
    const enemyCount = 3 + Math.floor(game.wave / 2);
    
    for (let i = 0; i < enemyCount; i++) {
        let type = 'MEDIUM';
        if (game.wave % 3 === 0) type = 'BOSS';
        else if (Math.random() < 0.3) type = 'WEAK';
        else if (Math.random() < 0.2) type = 'STRONG';
        
        spawnEnemy(type);
        game.waveEnemiesSpawned++;
    }
}

// Draw game
function draw() {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, game.width, game.height);
    
    // Draw player
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(game.player.x, game.player.y, game.player.width, game.player.height);
    
    // Draw shield
    if (game.player.shield > 0) {
        ctx.strokeStyle = `rgba(100, 200, 255, ${game.player.shield / 30})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(game.player.x + game.player.width / 2, game.player.y + game.player.height / 2, 50, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw enemies
    for (const enemy of game.enemies) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Health bar
        const healthPercent = enemy.health / enemy.maxHealth;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(enemy.x, enemy.y - 5, enemy.width * healthPercent, 3);
        ctx.strokeStyle = '#666';
        ctx.strokeRect(enemy.x, enemy.y - 5, enemy.width, 3);
    }
    
    // Draw player bullets
    ctx.fillStyle = '#ffff00';
    for (const bullet of game.bullets) {
        ctx.fillRect(bullet.x - bullet.width/2, bullet.y - bullet.height/2, bullet.width, bullet.height);
    }
    
    // Draw grenades
    ctx.fillStyle = '#00ff00';
    for (const grenade of game.grenades) {
        ctx.beginPath();
        ctx.arc(grenade.x, grenade.y, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw explosions
    for (const explosion of game.explosions) {
        const alpha = explosion.life / 20;
        ctx.fillStyle = `rgba(255, 100, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw enemy bullets
    ctx.fillStyle = '#ff6600';
    for (const bullet of game.enemyBullets) {
        ctx.fillRect(bullet.x - bullet.width/2, bullet.y - bullet.height/2, bullet.width, bullet.height);
    }
    
    // Draw powerups
    for (const powerup of game.powerups) {
        ctx.fillStyle = powerup.type === 'health' ? '#ff4444' : powerup.type === 'ammo' ? '#4444ff' : '#44ff44';
        ctx.fillRect(powerup.x - 10, powerup.y - 10, 20, 20);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(powerup.x - 10, powerup.y - 10, 20, 20);
    }
    
    // Draw rapid fire indicator
    if (game.player.rapidFire > 0) {
        ctx.fillStyle = 'rgba(255, 200, 0, 0.5)';
        ctx.fillRect(game.player.x - 5, game.player.y - 5, game.player.width + 10, game.player.height + 10);
    }
    
    // Draw crosshair
    if (game.mouseX && game.mouseY) {
        ctx.strokeStyle = '#00ff0044';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(game.mouseX, game.mouseY, 15, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize game
function init() {
    nextWave();
    document.getElementById('status').textContent = 'MISSION ONLINE | Q: Grenade | E: Shield | SPACE/CLICK: Shoot | Arrow Keys: Move';
    gameLoop();
}

// Start game when page loads
window.addEventListener('load', init);
