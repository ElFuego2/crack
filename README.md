# 007: First Light

A 3D-style raycaster spy shooter built in pure HTML5 Canvas. Step into the shoes of Agent 007, infiltrate the facility, eliminate enemy operatives, and survive the mission.

## 🎮 Gameplay

- **Objective**: Navigate the underground base, clear the enemies, and stay alive.
- **Controls**:
  - **W / S**: Move forward / backward
  - **A / D**: Turn left / right
  - **Q / E**: Strafe left / right
  - **SPACE**: Shoot
  - **R**: Reload pistol
  - **T**: Load a new map

## 🕵️ Features

- **3D raycast rendering** inspired by early Doom-style shooters
- **Humanoid enemy models** with attack behavior
- **Pistol model drawn in first-person view**
- **Reload system** with 7-shot magazine and reserve ammo
- **Blood and gore effects** for kills and dismemberment
- **Multiple maps** with varied wall and lighting colors

## 🏃 How to Run

1. Open `index.html` in your browser, or use a local server.
2. Use the controls above to move, turn, strafe, and shoot.
3. Survive, collect pickups, and eliminate enemies.
4. Press **R** to restart the mission at any time.

## 📦 Files

- `index.html` — Game host page and canvas layout
- `game.js` — Raycaster game logic and enemy systems
- `styles.css` — Visual styling for the page
- `package.json` — Project metadata and helper scripts

## 🛠️ Run Locally

Recommended: use a local web server.

```bash
cd /workspaces/crack
python3 -m http.server 8000
```

Then visit: `http://localhost:8000`

## 🎯 Notes

This is a retro-inspired 3D shooter experience built without external game engines. The raycaster gives the illusion of depth using texture-less wall slices and simple enemy sprites.

## 🔧 License

Licensed under the MIT License. See `LICENSE` for details.
