// 007: First Light - 3D-style Shooter
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 800;

const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,1,1,0,0,0,1,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,1,0,1,0,0,1],
  [1,0,0,1,0,1,1,1,1,0,1,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,0,0,1,0,1,1,1,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1],
  [1,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
  [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
  [1,0,0,0,1,1,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
const TILE = 64;
const FOV = Math.PI / 3;
const NUM_RAYS = canvas.width;
const MAX_DEPTH = 1024;
const HALF_HEIGHT = canvas.height / 2;
const PROJ_COEFF = (canvas.width / 2) / Math.tan(FOV / 2);

const player = {
  x: TILE * 2.5,
  y: TILE * 2.5,
  angle: 0,
  speed: 2.8,
  rotSpeed: 0.045,
  health: 100,
  ammo: 80,
  score: 0,
  kills: 0,
  readyToShoot: true,
  shootCooldown: 0
};

const enemies = [
  { x: TILE * 8.2, y: TILE * 3.4, health: 40, alive: true, color: '#ff5555' },
  { x: TILE * 12.5, y: TILE * 11.2, health: 70, alive: true, color: '#ff2222' },
  { x: TILE * 6.4, y: TILE * 10.3, health: 100, alive: true, color: '#cc1122' },
  { x: TILE * 3.5, y: TILE * 8.6, health: 50, alive: true, color: '#ff7777' }
];

const pickups = [
  { x: TILE * 5.5, y: TILE * 5.5, type: 'ammo' },
  { x: TILE * 11.2, y: TILE * 4.2, type: 'health' },
  { x: TILE * 13.2, y: TILE * 9.2, type: 'ammo' }
];

const keys = {};
let gameActive = true;
let statusText = 'MISSION: FIRST LIGHT | Clear the facility.';

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === 'r' || e.key === 'R') location.reload();
  if (e.key === ' ') shoot();
});
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

function normalizeAngle(angle) {
  angle %= Math.PI * 2;
  if (angle < 0) angle += Math.PI * 2;
  return angle;
}

function mapHasWall(x, y) {
  if (x < 0 || y < 0 || x >= MAP[0].length || y >= MAP.length) return true;
  return MAP[y][x] !== 0;
}

function castRay(rayAngle) {
  rayAngle = normalizeAngle(rayAngle);
  const isFacingDown = rayAngle > 0 && rayAngle < Math.PI;
  const isFacingRight = rayAngle < Math.PI / 2 || rayAngle > 3 * Math.PI / 2;

  let distance = 0;
  let wallHitX = 0;
  let wallHitY = 0;
  let wallColor = '#888';
  let hitVertical = false;

  const sin = Math.sin(rayAngle);
  const cos = Math.cos(rayAngle);

  let xIntercept, yIntercept, xStep, yStep;

  // Vertical intersections
  let found = false;
  xIntercept = Math.floor(player.x / TILE) * TILE;
  xIntercept += isFacingRight ? TILE : 0;
  yIntercept = player.y + (xIntercept - player.x) * (sin / cos);

  xStep = isFacingRight ? TILE : -TILE;
  yStep = xStep * (sin / cos);

  let nextX = xIntercept;
  let nextY = yIntercept;

  for (let i = 0; i < MAX_DEPTH; i++) {
    const tileX = Math.floor((nextX + (isFacingRight ? 0 : -1)) / TILE);
    const tileY = Math.floor(nextY / TILE);
    if (mapHasWall(tileX, tileY)) {
      found = true;
      wallHitX = nextX;
      wallHitY = nextY;
      wallColor = '#999';
      hitVertical = true;
      break;
    }
    nextX += xStep;
    nextY += yStep;
  }

  const vertDist = found ? Math.hypot(nextX - player.x, nextY - player.y) : Infinity;

  // Horizontal intersections
  found = false;
  yIntercept = Math.floor(player.y / TILE) * TILE;
  yIntercept += isFacingDown ? TILE : 0;
  xIntercept = player.x + (yIntercept - player.y) * (cos / sin);

  yStep = isFacingDown ? TILE : -TILE;
  xStep = yStep * (cos / sin);

  nextX = xIntercept;
  nextY = yIntercept;

  for (let i = 0; i < MAX_DEPTH; i++) {
    const tileX = Math.floor(nextX / TILE);
    const tileY = Math.floor((nextY + (isFacingDown ? 0 : -1)) / TILE);
    if (mapHasWall(tileX, tileY)) {
      const horizDist = Math.hypot(nextX - player.x, nextY - player.y);
      if (horizDist < vertDist) {
        wallHitX = nextX;
        wallHitY = nextY;
        wallColor = '#777';
        hitVertical = false;
        distance = horizDist;
      } else {
        distance = vertDist;
        hitVertical = true;
      }
      found = true;
      break;
    }
    nextX += xStep;
    nextY += yStep;
  }

  if (!found) distance = Math.min(vertDist, MAX_DEPTH);
  else if (distance === 0) distance = Math.min(vertDist, Math.hypot(nextX - player.x, nextY - player.y));

  return { distance, wallColor, hitVertical };
}

function drawScene() {
  ctx.fillStyle = '#1d1d1d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#444';
  ctx.fillRect(0, 0, canvas.width, HALF_HEIGHT);
  ctx.fillStyle = '#222';
  ctx.fillRect(0, HALF_HEIGHT, canvas.width, HALF_HEIGHT);

  const zBuffer = [];
  for (let column = 0; column < NUM_RAYS; column++) {
    const rayAngle = player.angle - FOV / 2 + (column / NUM_RAYS) * FOV;
    const ray = castRay(rayAngle);
    const correctedDistance = ray.distance * Math.cos(rayAngle - player.angle);
    const wallHeight = (TILE / correctedDistance) * PROJ_COEFF;
    const wallTop = Math.floor(HALF_HEIGHT - wallHeight / 2);
    const wallBottom = Math.floor(HALF_HEIGHT + wallHeight / 2);

    const shade = ray.hitVertical ? 0.7 : 1;
    ctx.fillStyle = shadeColor(ray.wallColor, shade);
    ctx.fillRect(column, wallTop, 1, wallBottom - wallTop);
    zBuffer[column] = correctedDistance;
  }

  drawEnemies(zBuffer);
  drawUI();
}

function shadeColor(color, percent) {
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = f >> 16;
  const G = (f >> 8) & 0x00FF;
  const B = f & 0x0000FF;
  const newR = Math.round((t - R) * p + R);
  const newG = Math.round((t - G) * p + G);
  const newB = Math.round((t - B) * p + B);
  return `rgb(${newR},${newG},${newB})`;
}

function drawEnemies(zBuffer) {
  const sprites = enemies.filter(e => e.alive).map(enemy => {
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const distance = Math.hypot(dx, dy);
    const angleToEnemy = normalizeAngle(Math.atan2(dy, dx));
    const delta = normalizeAngle(angleToEnemy - player.angle);
    const withinFov = delta > Math.PI ? delta - Math.PI * 2 : delta;
    return { enemy, distance, angle: withinFov };
  }).filter(s => Math.abs(s.angle) < FOV / 2);

  sprites.sort((a, b) => b.distance - a.distance);

  for (const sprite of sprites) {
    const size = (TILE / sprite.distance) * PROJ_COEFF;
    const spriteX = Math.tan(sprite.angle) * PROJ_COEFF + canvas.width / 2 - size / 2;
    const screenX = Math.floor(spriteX);
    const screenY = HALF_HEIGHT - size / 2;
    const width = Math.floor(size);
    const height = Math.floor(size);

    if (screenX + width < 0 || screenX >= canvas.width) continue;
    const mid = Math.floor(screenX + width / 2);
    if (zBuffer[mid] && zBuffer[mid] < sprite.distance) continue;

    ctx.fillStyle = sprite.enemy.color;
    ctx.fillRect(screenX, screenY, width, height);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(screenX, screenY, width, height);

    const healthPercent = sprite.enemy.health / 100;
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(screenX, screenY - 10, width * healthPercent, 6);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(screenX, screenY - 10, width, 6);
  }
}

function shoot() {
  if (!gameActive || player.ammo <= 0 || player.shootCooldown > 0) return;
  player.ammo -= 1;
  player.shootCooldown = 8;
  const shotAngle = player.angle;
  const wallHit = castRay(shotAngle);
  const hit = enemies.filter(e => e.alive).map(enemy => {
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const distance = Math.hypot(dx, dy);
    const angleToEnemy = normalizeAngle(Math.atan2(dy, dx));
    let delta = normalizeAngle(angleToEnemy - shotAngle);
    if (delta > Math.PI) delta -= Math.PI * 2;
    return { enemy, distance, delta };
  }).filter(s => Math.abs(s.delta) < 0.12 && s.distance < wallHit.distance + 1).sort((a,b) => a.distance - b.distance)[0];

  if (hit && hit.distance < MAX_DEPTH) {
    hit.enemy.health -= 35;
    if (hit.enemy.health <= 0) {
      hit.enemy.alive = false;
      player.score += 200;
      player.kills += 1;
      statusText = 'Agent down. Continue, 007.';
    } else {
      statusText = 'Hit! Keep pushing.';
    }
  } else {
    statusText = 'Missed shot. Aim better.';
  }
}

function drawUI() {
  ctx.fillStyle = '#000000c0';
  ctx.fillRect(10, 10, 380, 120);
  ctx.fillStyle = '#00ff00';
  ctx.font = '20px Courier New';
  ctx.fillText(`007: First Light`, 20, 36);
  ctx.fillText(`HEALTH: ${player.health}`, 20, 64);
  ctx.fillText(`AMMO: ${player.ammo}`, 20, 92);
  ctx.fillText(`SCORE: ${player.score}`, 20, 120);
  ctx.fillStyle = '#ffff00';
  ctx.fillText(statusText, 430, 40);
  ctx.fillStyle = '#fff';
  ctx.font = '16px Courier New';
  ctx.fillText('W/S: Move  A/D: Turn  Q/E: Strafe', 430, 70);
  ctx.fillText('SPACE: Shoot  R: Restart', 430, 94);
  ctx.fillText('Enemies remaining: ' + enemies.filter(e => e.alive).length, 430, 118);
}

function update() {
  if (!gameActive) return;
  if (player.shootCooldown > 0) player.shootCooldown--;

  if (keys['w']) {
    const nx = player.x + Math.cos(player.angle) * player.speed;
    const ny = player.y + Math.sin(player.angle) * player.speed;
    movePlayer(nx, ny);
  }
  if (keys['s']) {
    const nx = player.x - Math.cos(player.angle) * player.speed;
    const ny = player.y - Math.sin(player.angle) * player.speed;
    movePlayer(nx, ny);
  }
  if (keys['a']) {
    player.angle -= player.rotSpeed;
  }
  if (keys['d']) {
    player.angle += player.rotSpeed;
  }
  if (keys['q']) {
    const nx = player.x - Math.sin(player.angle) * player.speed;
    const ny = player.y + Math.cos(player.angle) * player.speed;
    movePlayer(nx, ny);
  }
  if (keys['e']) {
    const nx = player.x + Math.sin(player.angle) * player.speed;
    const ny = player.y - Math.cos(player.angle) * player.speed;
    movePlayer(nx, ny);
  }

  player.angle = normalizeAngle(player.angle);

  checkPickups();
  checkEnemies();
  const aliveEnemies = enemies.filter(e => e.alive).length;
  if (aliveEnemies === 0) {
    gameActive = false;
    statusText = 'Mission complete. Extraction ready.';
  }
  if (player.health <= 0) {
    gameActive = false;
    statusText = 'Mission failed. You were compromised.';
  }
}

function movePlayer(x, y) {
  const mapX = Math.floor(x / TILE);
  const mapY = Math.floor(y / TILE);
  if (!mapHasWall(mapX, mapY)) {
    player.x = x;
    player.y = y;
  }
}

function checkPickups() {
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i];
    if (Math.hypot(player.x - p.x, player.y - p.y) < TILE / 1.5) {
      if (p.type === 'health') {
        player.health = Math.min(player.health + 40, 100);
        statusText = 'Health restored.';
      } else if (p.type === 'ammo') {
        player.ammo = Math.min(player.ammo + 30, 120);
        statusText = 'Ammo acquired.';
      }
      pickups.splice(i, 1);
    }
  }
}

function checkEnemies() {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 60) {
      player.health -= 0.8;
      if (player.health <= 0) player.health = 0;
    }
  }
}

function drawMinimap() {
  const scale = 0.12;
  const mapW = MAP[0].length * TILE * scale;
  const mapH = MAP.length * TILE * scale;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(canvas.width - mapW - 10, 10, mapW, mapH);
  for (let y = 0; y < MAP.length; y++) {
    for (let x = 0; x < MAP[0].length; x++) {
      if (MAP[y][x] !== 0) {
        ctx.fillStyle = '#777';
        ctx.fillRect(canvas.width - mapW - 10 + x * TILE * scale, 10 + y * TILE * scale, TILE * scale, TILE * scale);
      }
    }
  }
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(canvas.width - mapW - 10 + player.x * scale - 4, 10 + player.y * scale - 4, 8, 8);
  for (const enemy of enemies.filter(e => e.alive)) {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(canvas.width - mapW - 10 + enemy.x * scale - 3, 10 + enemy.y * scale - 3, 6, 6);
  }
}

function render() {
  drawScene();
  drawMinimap();
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

window.addEventListener('load', () => {
  statusText = 'MISSION: FIRST LIGHT | Infiltrate. Eliminate. Escape.';
  loop();
});
