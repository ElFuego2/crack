// 007: First Light - 3D-style Shooter
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 800;

const maps = [
  {
    name: 'Black Site Entrance',
    skyColor: '#2d3758',
    floorColor: '#141821',
    wallColors: {
      1: '#5a5a5a',
      2: '#3b6ae1',
      3: '#528f33',
      4: '#8b3fb8'
    },
    playerStart: { x: 2.8, y: 2.2 },
    enemies: [
      { x: 8.2, y: 3.5, type: 'guard', health: 80, speed: 1.1, color: '#d9383f' },
      { x: 12.4, y: 11.1, type: 'elite', health: 110, speed: 0.9, color: '#ffbd4d' },
      { x: 6.4, y: 10.2, type: 'guard', health: 70, speed: 1.3, color: '#ff5f5f' }
    ],
    pickups: [
      { x: 5.5, y: 5.3, type: 'ammo' },
      { x: 11.1, y: 4.4, type: 'health' },
      { x: 13.2, y: 9.3, type: 'ammo' }
    ],
    layout: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,2,0,0,0,1,1,0,0,0,2,0,0,1],
      [1,0,0,2,0,0,0,0,0,0,1,0,2,0,0,1],
      [1,0,0,2,0,3,3,3,1,0,1,0,2,0,0,1],
      [1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,3,3,3,3,0,0,1,0,4,4,4,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1],
      [1,0,0,2,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,0,2,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,0,2,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,0,0,2,2,0,1,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  },
  {
    name: 'Laboratory Depths',
    skyColor: '#3b2f41',
    floorColor: '#161b24',
    wallColors: {
      1: '#8a8a93',
      2: '#4f8aa5',
      3: '#c15f83',
      4: '#3cbf78'
    },
    playerStart: { x: 2.2, y: 12.5 },
    enemies: [
      { x: 9.1, y: 4.2, type: 'guard', health: 90, speed: 1.2, color: '#ff4c4c' },
      { x: 13.3, y: 7.9, type: 'guard', health: 75, speed: 1.4, color: '#ff6a6a' },
      { x: 6.8, y: 8.7, type: 'elite', health: 120, speed: 0.95, color: '#ffd24d' }
    ],
    pickups: [
      { x: 4.8, y: 10.2, type: 'health' },
      { x: 11.7, y: 6.8, type: 'ammo' },
      { x: 3.4, y: 4.4, type: 'ammo' }
    ],
    layout: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,2,2,0,0,0,1,0,0,0,2,2,0,0,1],
      [1,0,2,0,0,0,0,1,0,0,0,0,2,0,0,1],
      [1,0,2,0,3,3,0,1,0,0,3,3,0,2,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,0,4,4,4,0,1,0,0,4,4,4,0,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,2,2,0,0,0,1,0,0,0,1,0,0,2,1],
      [1,0,2,0,0,0,0,1,0,0,0,1,0,2,0,1],
      [1,0,0,0,2,2,0,1,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  },
  {
    name: 'Vault Corridor',
    skyColor: '#2e301a',
    floorColor: '#11120d',
    wallColors: {
      1: '#7d7d76',
      2: '#b4b14f',
      3: '#9a5e45',
      4: '#5c8d8a'
    },
    playerStart: { x: 2.4, y: 2.6 },
    enemies: [
      { x: 8.4, y: 4.9, type: 'guard', health: 85, speed: 1.15, color: '#db4a4a' },
      { x: 10.6, y: 8.8, type: 'guard', health: 80, speed: 1.3, color: '#ff7272' },
      { x: 5.1, y: 9.6, type: 'elite', health: 130, speed: 0.85, color: '#f1c537' }
    ],
    pickups: [
      { x: 4.1, y: 4.5, type: 'ammo' },
      { x: 12.2, y: 9.1, type: 'health' },
      { x: 7.1, y: 6.4, type: 'ammo' }
    ],
    layout: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,0,2,0,0,0,1,0,0,0,2,0,0,0,1],
      [1,0,0,2,0,3,0,1,0,4,0,2,0,0,0,1],
      [1,0,0,2,0,3,0,0,0,4,0,0,0,0,0,1],
      [1,0,0,0,0,3,0,0,0,4,0,0,0,0,0,1],
      [1,0,0,0,0,3,0,0,0,4,0,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,2,2,0,0,0,1,0,0,0,1,0,0,2,1],
      [1,0,2,0,0,0,0,1,0,0,0,1,0,2,0,1],
      [1,0,0,0,2,2,0,1,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  }
];

const TILE = 64;
const FOV = Math.PI / 3;
const NUM_RAYS = canvas.width;
const MAX_DEPTH = 1024;
const HALF_HEIGHT = canvas.height / 2;
const PROJ_COEFF = (canvas.width / 2) / Math.tan(FOV / 2);

let currentMapIndex = 0;
let MAP = [];

const player = {
  x: 0,
  y: 0,
  angle: 0,
  speed: 2.8,
  rotSpeed: 0.045,
  health: 100,
  clipSize: 7,
  currentAmmo: 7,
  ammoReserve: 28,
  score: 0,
  kills: 0,
  shootCooldown: 0,
  reloadCooldown: 0,
  reloading: false
};

const enemies = [];
const pickups = [];
const goreEffects = [];
const keys = {};
let gameActive = true;
let statusText = 'MISSION: FIRST LIGHT | Clear the facility.';

function loadMap(index) {
  currentMapIndex = index % maps.length;
  const map = maps[currentMapIndex];
  MAP = map.layout.map(row => row.slice());
  player.angle = 0;
  player.health = 100;
  player.currentAmmo = player.clipSize;
  player.ammoReserve = 28;
  player.score = 0;
  player.kills = 0;
  player.shootCooldown = 0;
  player.reloading = false;
  player.reloadCooldown = 0;
  player.x = map.playerStart.x * TILE;
  player.y = map.playerStart.y * TILE;
  gameActive = true;
  setUpMapEntities(map);
}

function setUpMapEntities(map) {
  enemies.length = 0;
  pickups.length = 0;
  goreEffects.length = 0;

  map.enemies.forEach(enemy => {
    enemies.push({
      x: enemy.x * TILE,
      y: enemy.y * TILE,
      type: enemy.type,
      health: enemy.health,
      speed: enemy.speed,
      color: enemy.color,
      alive: true,
      attackCooldown: 0
    });
  });

  map.pickups.forEach(pickup => {
    pickups.push({ x: pickup.x * TILE, y: pickup.y * TILE, type: pickup.type });
  });
}

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === 'r' || e.key === 'R') reloadWeapon();
  if (e.key === 't' || e.key === 'T') loadMap(Math.floor(Math.random() * maps.length));
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

function getWallColor(tile) {
  return maps[currentMapIndex].wallColors[tile] || '#999999';
}

function castRay(rayAngle) {
  rayAngle = normalizeAngle(rayAngle);
  const isFacingDown = rayAngle > 0 && rayAngle < Math.PI;
  const isFacingRight = rayAngle < Math.PI / 2 || rayAngle > 3 * Math.PI / 2;

  const sin = Math.sin(rayAngle);
  const cos = Math.cos(rayAngle);
  const safeSin = Math.abs(sin) < 1e-6 ? 1e-6 * Math.sign(sin || 1) : sin;
  const safeCos = Math.abs(cos) < 1e-6 ? 1e-6 * Math.sign(cos || 1) : cos;

  let wallHitX = 0;
  let wallHitY = 0;
  let wallColor = '#999999';
  let hitVertical = false;
  let distance = MAX_DEPTH;

  // Vertical intersections
  let xIntercept = Math.floor(player.x / TILE) * TILE;
  xIntercept += isFacingRight ? TILE : 0;
  let yIntercept = player.y + (xIntercept - player.x) * (safeSin / safeCos);

  let xStep = isFacingRight ? TILE : -TILE;
  let yStep = xStep * (safeSin / safeCos);

  let nextX = xIntercept;
  let nextY = yIntercept;

  for (let i = 0; i < MAX_DEPTH; i++) {
    const tileX = Math.floor((nextX + (isFacingRight ? 0 : -1)) / TILE);
    const tileY = Math.floor(nextY / TILE);
    if (mapHasWall(tileX, tileY)) {
      const tileValue = MAP[tileY][tileX];
      wallHitX = nextX;
      wallHitY = nextY;
      wallColor = getWallColor(tileValue);
      hitVertical = true;
      distance = Math.hypot(nextX - player.x, nextY - player.y);
      break;
    }
    nextX += xStep;
    nextY += yStep;
  }

  const vertDist = distance;

  // Horizontal intersections
  yIntercept = Math.floor(player.y / TILE) * TILE;
  yIntercept += isFacingDown ? TILE : 0;
  xIntercept = player.x + (yIntercept - player.y) * (safeCos / safeSin);

  yStep = isFacingDown ? TILE : -TILE;
  xStep = yStep * (safeCos / safeSin);

  nextX = xIntercept;
  nextY = yIntercept;

  for (let i = 0; i < MAX_DEPTH; i++) {
    const tileX = Math.floor(nextX / TILE);
    const tileY = Math.floor((nextY + (isFacingDown ? 0 : -1)) / TILE);
    if (mapHasWall(tileX, tileY)) {
      const horizDist = Math.hypot(nextX - player.x, nextY - player.y);
      if (horizDist < vertDist) {
        const tileValue = MAP[tileY][tileX];
        wallHitX = nextX;
        wallHitY = nextY;
        wallColor = getWallColor(tileValue);
        hitVertical = false;
        distance = horizDist;
      }
      break;
    }
    nextX += xStep;
    nextY += yStep;
  }

  return { distance: Math.min(distance, MAX_DEPTH), wallColor, hitVertical };
}

function drawScene() {
  const map = maps[currentMapIndex];
  ctx.fillStyle = map.skyColor;
  ctx.fillRect(0, 0, canvas.width, HALF_HEIGHT);
  ctx.fillStyle = map.floorColor;
  ctx.fillRect(0, HALF_HEIGHT, canvas.width, HALF_HEIGHT);

  const zBuffer = [];
  for (let column = 0; column < NUM_RAYS; column++) {
    const rayAngle = player.angle - FOV / 2 + (column / NUM_RAYS) * FOV;
    const ray = castRay(rayAngle);
    const correctedDistance = Math.max(ray.distance * Math.cos(rayAngle - player.angle), 1);
    const wallHeight = (TILE / correctedDistance) * PROJ_COEFF;
    const wallTop = Math.floor(HALF_HEIGHT - wallHeight / 2);
    const wallBottom = Math.floor(HALF_HEIGHT + wallHeight / 2);

    const shade = ray.hitVertical ? 0.75 : 1;
    ctx.fillStyle = shadeColor(ray.wallColor, shade);
    ctx.fillRect(column, wallTop, 1, wallBottom - wallTop);
    zBuffer[column] = correctedDistance;
  }

  drawEnemies(zBuffer);
  drawGore(zBuffer);
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
    let delta = normalizeAngle(angleToEnemy - player.angle);
    if (delta > Math.PI) delta -= Math.PI * 2;
    return { enemy, distance, angle: delta };
  }).filter(s => Math.abs(s.angle) < FOV / 2);

  sprites.sort((a, b) => b.distance - a.distance);

  for (const sprite of sprites) {
    if (sprite.distance < 20) continue;
    const size = (TILE / sprite.distance) * PROJ_COEFF;
    const spriteX = Math.tan(sprite.angle) * PROJ_COEFF + canvas.width / 2 - size / 2;
    const screenX = Math.floor(spriteX);
    const screenY = HALF_HEIGHT - size * 0.8;
    const width = Math.floor(size);
    const height = Math.floor(size);

    if (screenX + width < 0 || screenX >= canvas.width) continue;
    const mid = Math.floor(screenX + width / 2);
    if (zBuffer[mid] && zBuffer[mid] < sprite.distance) continue;

    drawHumanSprite(screenX, screenY, width, height, sprite.enemy);
  }
}

function drawHumanSprite(x, y, width, height, enemy) {
  const torsoHeight = height * 0.45;
  const torsoWidth = width * 0.25;
  const headRadius = width * 0.12;
  const torsoX = x + width * 0.375;
  const torsoY = y + headRadius * 1.3;

  // body
  ctx.fillStyle = enemy.color;
  ctx.fillRect(torsoX, torsoY, torsoWidth, torsoHeight);

  // head
  ctx.fillStyle = '#e6c9a1';
  ctx.beginPath();
  ctx.arc(x + width * 0.5, y + headRadius, headRadius, 0, Math.PI * 2);
  ctx.fill();

  // legs
  ctx.fillStyle = '#222';
  ctx.fillRect(torsoX, torsoY + torsoHeight, torsoWidth * 0.4, height * 0.18);
  ctx.fillRect(torsoX + torsoWidth * 0.6, torsoY + torsoHeight, torsoWidth * 0.4, height * 0.18);

  // arms
  ctx.fillStyle = '#333';
  ctx.fillRect(torsoX - width * 0.12, torsoY + height * 0.08, width * 0.12, height * 0.18);
  ctx.fillRect(torsoX + torsoWidth, torsoY + height * 0.08, width * 0.12, height * 0.18);

  // visor or helmet
  ctx.fillStyle = '#111';
  ctx.fillRect(x + width * 0.39, y + headRadius * 0.6, width * 0.22, headRadius * 0.22);

  // health indicator
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(x, y - 12, width * (enemy.health / 130), 6);
  ctx.strokeStyle = '#fff';
  ctx.strokeRect(x, y - 12, width, 6);
}

function shoot() {
  if (!gameActive || player.reloading || player.shootCooldown > 0) return;
  if (player.currentAmmo <= 0) {
    statusText = 'Magazine empty. Press R to reload.';
    return;
  }
  player.currentAmmo -= 1;
  player.shootCooldown = 8;

  const shotAngle = player.angle;
  const wallHit = castRay(shotAngle);
  const hitEnemy = enemies.filter(e => e.alive).map(enemy => {
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const distance = Math.hypot(dx, dy);
    const angleToEnemy = normalizeAngle(Math.atan2(dy, dx));
    let delta = normalizeAngle(angleToEnemy - shotAngle);
    if (delta > Math.PI) delta -= Math.PI * 2;
    return { enemy, distance, delta };
  }).filter(s => Math.abs(s.delta) < 0.12 && s.distance < wallHit.distance + 1).sort((a, b) => a.distance - b.distance)[0];

  if (hitEnemy) {
    const target = hitEnemy.enemy;
    target.health -= target.type === 'elite' ? 42 : 35;
    statusText = target.type === 'elite' ? 'Elite guard hit!' : 'Body shot!';
    if (target.health <= 0) {
      target.alive = false;
      player.score += target.type === 'elite' ? 350 : 180;
      player.kills += 1;
      spawnGore(target);
      statusText = 'Critical hit. Enemy down.';
    }
  } else {
    statusText = 'Missed. Adjust your aim.';
  }
}

function reloadWeapon() {
  if (!gameActive) return;
  if (player.reloading) return;
  if (player.currentAmmo === player.clipSize) {
    statusText = 'Magazine already full.';
    return;
  }
  if (player.ammoReserve === 0) {
    statusText = 'No reserve ammo left!';
    return;
  }
  player.reloading = true;
  player.reloadCooldown = 45;
  statusText = 'Reloading pistol...';
}

function drawUI() {
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(10, 10, 420, 160);
  ctx.fillStyle = '#00ff00';
  ctx.font = '22px Courier New';
  ctx.fillText('007: First Light', 20, 38);
  ctx.font = '18px Courier New';
  ctx.fillText(`MAP: ${maps[currentMapIndex].name}`, 20, 64);
  ctx.fillText(`HEALTH: ${player.health.toFixed(0)}`, 20, 92);
  ctx.fillText(`AMMO: ${player.currentAmmo}/${player.clipSize}  RESERVE: ${player.ammoReserve}`, 20, 120);
  ctx.fillText(`SCORE: ${player.score}`, 20, 148);
  ctx.fillStyle = '#ffff00';
  ctx.fillText(statusText, 460, 38);
  ctx.fillStyle = '#fff';
  ctx.font = '16px Courier New';
  ctx.fillText('W/S: Move  A/D: Turn  Q/E: Strafe', 460, 70);
  ctx.fillText('SPACE: Shoot  R: Reload  T: New map', 460, 96);
  ctx.fillText('Close enemies will attack you.', 460, 122);
  ctx.fillText('Clear all guards to complete the mission.', 460, 148);
}

function update() {
  if (!gameActive) return;
  if (player.shootCooldown > 0) player.shootCooldown--;
  if (player.reloading) {
    player.reloadCooldown -= 1;
    if (player.reloadCooldown <= 0) {
      const needed = player.clipSize - player.currentAmmo;
      const take = Math.min(needed, player.ammoReserve);
      player.currentAmmo += take;
      player.ammoReserve -= take;
      player.reloading = false;
      statusText = take > 0 ? 'Reload complete.' : 'No ammo to reload.';
    }
  }

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
  if (keys['a']) player.angle -= player.rotSpeed;
  if (keys['d']) player.angle += player.rotSpeed;
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
  moveEnemies();
  if (player.health <= 0) {
    gameActive = false;
    statusText = 'Mission failed. You were compromised.';
  }
  if (enemies.filter(e => e.alive).length === 0) {
    gameActive = false;
    statusText = 'Mission complete. Extraction ready.';
  }
  updateGore();
}

function movePlayer(x, y) {
  const mapX = Math.floor(x / TILE);
  const mapY = Math.floor(y / TILE);
  if (!mapHasWall(mapX, mapY)) {
    player.x = x;
    player.y = y;
  }
}

function moveEnemies() {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;
    if (enemy.attackCooldown > 0) enemy.attackCooldown--;
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 70) {
      if (enemy.attackCooldown <= 0) {
        enemy.attackCooldown = 40;
        player.health -= enemy.type === 'elite' ? 12 : 8;
        statusText = enemy.type === 'elite' ? 'Elite hit you!' : 'Guard attack!';
      }
      return;
    }

    if (distance < 420) {
      const angle = Math.atan2(dy, dx);
      const stepX = Math.cos(angle) * enemy.speed;
      const stepY = Math.sin(angle) * enemy.speed;
      const nextX = enemy.x + stepX;
      const nextY = enemy.y + stepY;
      const mapX = Math.floor(nextX / TILE);
      const mapY = Math.floor(nextY / TILE);
      if (!mapHasWall(mapX, mapY)) {
        enemy.x = nextX;
        enemy.y = nextY;
      }
    }
  });
}

function checkPickups() {
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i];
    if (Math.hypot(player.x - p.x, player.y - p.y) < TILE / 1.5) {
      if (p.type === 'health') {
        player.health = Math.min(player.health + 45, 100);
        statusText = 'Health pack collected.';
      } else if (p.type === 'ammo') {
        player.ammoReserve += 14;
        statusText = 'Ammo pack collected.';
      }
      pickups.splice(i, 1);
    }
  }
}

function spawnGore(enemy) {
  for (let i = 0; i < 8; i++) {
    goreEffects.push({
      x: enemy.x + (Math.random() - 0.5) * 30,
      y: enemy.y + (Math.random() - 0.5) * 30,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      life: 70,
      size: 6 + Math.random() * 8,
      color: '#c50909'
    });
  }
  goreEffects.push({
    x: enemy.x,
    y: enemy.y,
    dx: (Math.random() - 0.5) * 1.2,
    dy: (Math.random() - 0.5) * 1.2,
    life: 90,
    size: 14,
    color: '#4f0000',
    type: 'limb'
  });
}

function updateGore() {
  for (let i = goreEffects.length - 1; i >= 0; i--) {
    const g = goreEffects[i];
    g.x += g.dx;
    g.y += g.dy;
    g.life -= 1;
    if (g.life <= 0) goreEffects.splice(i, 1);
  }
}

function drawGore(zBuffer) {
  goreEffects.forEach(g => {
    const dx = g.x - player.x;
    const dy = g.y - player.y;
    const distance = Math.hypot(dx, dy);
    const angleToGore = normalizeAngle(Math.atan2(dy, dx));
    let delta = normalizeAngle(angleToGore - player.angle);
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (Math.abs(delta) >= FOV / 2) return;
    const size = ((g.type === 'limb' ? 1.2 : 0.7) * TILE / distance) * PROJ_COEFF;
    const screenX = Math.tan(delta) * PROJ_COEFF + canvas.width / 2 - size / 2;
    const screenY = HALF_HEIGHT - size * 0.7;
    const alpha = Math.max(0, g.life / 70);
    ctx.fillStyle = `rgba(${parseInt(g.color.slice(1, 3), 16)},${parseInt(g.color.slice(3, 5), 16)},${parseInt(g.color.slice(5), 16)},${alpha})`;
    ctx.fillRect(screenX, screenY, size, size * 0.35);
  });
}

function drawMinimap() {
  const scale = 0.12;
  const mapW = MAP[0].length * TILE * scale;
  const mapH = MAP.length * TILE * scale;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(canvas.width - mapW - 10, 10, mapW, mapH);

  for (let y = 0; y < MAP.length; y++) {
    for (let x = 0; x < MAP[0].length; x++) {
      if (MAP[y][x] !== 0) {
        ctx.fillStyle = getWallColor(MAP[y][x]);
        ctx.fillRect(canvas.width - mapW - 10 + x * TILE * scale, 10 + y * TILE * scale, TILE * scale, TILE * scale);
      }
    }
  }

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(canvas.width - mapW - 10 + player.x * scale - 4, 10 + player.y * scale - 4, 8, 8);
  pickups.forEach(p => {
    ctx.fillStyle = p.type === 'health' ? '#4cff4c' : '#f0f056';
    ctx.fillRect(canvas.width - mapW - 10 + p.x * scale - 3, 10 + p.y * scale - 3, 6, 6);
  });
  enemies.filter(e => e.alive).forEach(enemy => {
    ctx.fillStyle = '#ff2d2d';
    ctx.fillRect(canvas.width - mapW - 10 + enemy.x * scale - 3, 10 + enemy.y * scale - 3, 6, 6);
  });
}

function drawWeapon() {
  const centerX = canvas.width / 2;
  const baseY = canvas.height - 90;
  ctx.fillStyle = '#4b4b4b';
  ctx.fillRect(centerX - 110, baseY, 220, 26);
  ctx.fillRect(centerX - 60, baseY - 18, 120, 18);
  ctx.fillRect(centerX + 50, baseY + 6, 38, 12);
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(centerX - 90, baseY + 26, 30, 28);
  ctx.fillRect(centerX - 40, baseY + 26, 50, 14);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(centerX + 80, baseY + 8, 10, 10);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - 110, baseY, 220, 26);
  ctx.strokeRect(centerX - 90, baseY + 26, 30, 28);
  ctx.strokeRect(centerX - 40, baseY + 26, 50, 14);
}

function render() {
  drawScene();
  drawWeapon();
  drawMinimap();
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

window.addEventListener('load', () => {
  loadMap(Math.floor(Math.random() * maps.length));
  statusText = 'MISSION: FIRST LIGHT | Infiltrate. Eliminate. Escape.';
  loop();
});
