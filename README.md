# 007: First Light

A 3D-style raycaster spy shooter built in pure HTML5 Canvas. Step into the shoes of Agent 007, infiltrate the facility, eliminate enemy operatives, and survive the mission.

## 🎮 Gameplay

- **Objective**: Navigate the underground base, clear the enemies, and stay alive.
- **Controls**:
  - **W / S**: Move forward / backward
  - **A / D**: Turn left / right
  - **Q / E**: Strafe left / right
  - **SPACE**: Shoot
  - **R**: Restart the mission

## 🕵️ Features

- **3D raycast rendering** inspired by early Doom-style shooters
- **Enemy sprites** projected into the 3D view
- **Health and ammo pickups** scattered through the map
- **Mini-map overlay** for tactical navigation
- **Dynamic UI** rendered directly inside the game canvas
- **Spy-thriller styling** with a 007-themed mission briefing

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
