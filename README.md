# 007: Agent Protocol

A spy action game built with Phaser 3. Take on the role of secret agent Bond and eliminate enemy operatives!

## 🎮 Gameplay

- **Objective**: Eliminate 5 enemy agents to complete your mission
- **Controls**:
  - **Arrow Keys**: Move around the arena
  - **Mouse Click / SPACE**: Shoot in the direction of your cursor
  - **R**: Restart the game
  - **SPACE**: Continue after game over

## 🕵️ Features

- **Player Character**: You control Agent Bond (green square)
- **Enemy AI**: Red enemy agents that patrol and chase you when spotted
- **Combat**: Shoot enemies with yellow bullets
- **Damage System**: Both you and enemies take damage from bullets
- **Health**: You have 100 health, lose health when hit by enemy fire
- **Scoring**: Earn 100 points for each enemy eliminated
- **Mission Tracking**: Track your progress toward the 5-enemy objective

## 🏃 How to Play

1. Open `index.html` in your web browser
2. Use arrow keys to move around the arena
3. Click or press SPACE to shoot enemies
4. Enemies will chase you when you get close (within 300 pixels)
5. Eliminate all 5 enemies to win the mission
6. Avoid enemy fire - if your health reaches 0, you lose
7. Press R at any time to restart, or SPACE at game over

## 📊 Game Elements

- **Player (Green)**: Your character - don't let it get destroyed
- **Enemies (Red)**: Target these enemies with your gunfire
- **Bullets (Yellow/Orange)**: Your shots (yellow) and enemy shots (orange)
- **Health**: Displayed in top-left corner
- **Score**: Tracks mission progress

## 🛠️ Technical Details

- Built with **Phaser 3** game framework
- Uses arcade physics for movement and collision
- Dynamic enemy spawning and AI
- Procedurally generated graphics (no external assets needed)
- Responsive controls and smooth gameplay

## 🎯 Tips for Success

1. Keep moving - standing still makes you an easy target
2. Use the edges of the screen for cover
3. Try to engage one enemy at a time
4. Lead your shots - enemies move quickly
5. When surrounded, move toward the edges to break line of sight

## 📝 License

Licensed under the MIT License. See LICENSE file for details.

---

**Ready for your next mission, Agent?** Good luck! 🔫
