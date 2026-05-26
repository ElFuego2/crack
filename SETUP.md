# 007: Agent Protocol - Setup Guide

## Quick Start

The game is a web-based game that runs directly in your browser. Here are the easiest ways to run it:

### Option 1: Python HTTP Server (Recommended)

If you have Python 3 installed:

```bash
cd /workspaces/crack
python3 -m http.server 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Node.js HTTP Server

If you have Node.js installed:

```bash
cd /workspaces/crack
npx http-server -p 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 3: Direct File Opening

Simply open `index.html` directly in your browser (though some features may be limited without a web server).

## Game Files

- **index.html** - Main game page
- **game.js** - Game logic and Phaser scenes
- **styles.css** - Game styling and UI
- **package.json** - Project metadata

## System Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (to load Phaser 3 from CDN)
- No additional installations needed!

## Gameplay Controls

| Key | Action |
|-----|--------|
| **Arrow Keys** | Move Agent Bond |
| **SPACE** | Shoot enemies |
| **R** | Restart game |
| **Mouse** | Aim direction for shots |

## Mission Objective

Complete the mission by:
1. Eliminating 5 enemy agents
2. Keep your health above 0
3. Survive and complete the objective!

## Game Features Included

✅ Playable agent character  
✅ 5 enemy AI agents with chase logic  
✅ Shooting mechanics with collision detection  
✅ Health system for player and enemies  
✅ Scoring system  
✅ Mission tracking  
✅ Game over screen with restart  
✅ Procedurally generated graphics  
✅ Smooth physics-based movement  

## Extending the Game

The game is built with Phaser 3 and can be easily extended with:

- Additional enemy types
- Power-ups and gadgets
- Different game levels
- Sound effects and music
- Multiple missions
- Leaderboard system
- Improved graphics and animations

## Troubleshooting

**Game won't load?**
- Make sure you're running it through a web server (not opening HTML directly)
- Check that you have an internet connection (Phaser CDN)
- Try a different browser

**Game runs slowly?**
- Close other browser tabs
- Try a different browser
- Reduce screen resolution if needed

**Controls not working?**
- Make sure the game window is focused (click on it)
- Try using arrow keys or mouse
- Refresh the page

---

**Ready for your mission? Good luck, Agent! 🔫**
