# 007: First Light - Setup Guide

## Run the game locally

The easiest way to run `007: First Light` is with a simple local web server.

### Option 1: Python HTTP Server

```bash
cd /workspaces/crack
python3 -m http.server 8000
```

Open your browser at: `http://localhost:8000`

### Option 2: Node.js HTTP Server

```bash
cd /workspaces/crack
npx http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 3: Open Directly

You can also open `index.html` straight in your browser, but a local server is recommended for best compatibility.

## Files

- `index.html` — Main game page
- `game.js` — Core raycaster game engine
- `styles.css` — Page styling
- `README.md` — Project documentation
- `LICENSE` — License terms

## Controls

- **W / S**: Move forward / backward
- **A / D**: Turn left / right
- **Q / E**: Strafe left / right
- **SPACE**: Shoot
- **R**: Restart the mission

## Gameplay

Move through the facility, eliminate enemy agents, and collect health and ammo packs. The game uses a 3D-style raycast renderer to recreate a retro shooter feel with a 007 spy theme.

## Notes

- Use the minimap to track enemy positions and your location.
- Pick up ammo and health to survive longer.
- Aim carefully; your shots are limited.
