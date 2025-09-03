# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ward No.13 (13号病房)** is a web-based horror escape game developed by a 6-student university team. This is currently a showcase website that demonstrates the game concept with plans for full game implementation.

## Development Commands

**This is a static HTML/CSS/JavaScript project with no build process.**

- **Local Development**: Open any HTML file directly in a browser
- **Testing**: Manual testing in browser (no automated test framework)
- **Deployment**: Static hosting (GitHub Pages, Netlify, Vercel)

No package manager, build tools, or test runners are used.

## Architecture

### Technical Stack
- **Pure Web Technologies**: HTML5, CSS3, JavaScript ES6+ (no frameworks)
- **State Management**: LocalStorage for user authentication
- **Audio System**: HTML5 Audio API with custom BGMManager class
- **Styling**: CSS custom properties (variables) for theming
- **Animation**: CSS transitions/animations + scroll-triggered effects

### Code Organization
```
├── index.html            # Main homepage
├── bgm-manager.js        # Audio management module
├── codes/                # Game pages and core functionality
│   ├── login.html        # User login page
│   ├── register.html     # User registration page
│   ├── team.html         # Development team showcase
│   ├── prologue.html     # Game opening sequence
│   ├── part_1_1.html     # First game chapter (canvas-based)
│   ├── part_1_2.html     # Second game chapter
│   ├── part_2.html       # Third game chapter
│   ├── endings.html      # Multiple game endings
│   ├── 转场1.html         # Transition scene
│   └── [member].html     # Individual team member pages (lhl, wcr, wjp, etc.)
├── audio/                # Audio assets (MP3 format)
├── pictures/             # Game assets and team photos
│   ├── [character].jpg   # Team member photos
│   ├── [game_assets].png # In-game sprites and backgrounds
│   └── [story_items].jpg # Story-related images
└── README.md            # Basic project description
```

### Key Architectural Patterns

**Unified Page Structure**: All HTML pages follow the same architectural pattern:
- Consistent CSS variable system for theming (`--primary-color`, `--dark-red`, etc.)
- Shared BGM manager integration
- Common scroll-triggered animation system
- Responsive design patterns

**BGM Manager**: Object-oriented audio management
- Class-based architecture (`BGMManager`)
- Handles play/pause controls, UI state sync, error handling
- Integrated across all pages with consistent behavior

**Canvas-based Game System**: Game chapters use HTML5 Canvas for 2D gameplay
- Character animation with sprite sequences (walk1, walk2, walk3, stand1, stand2)
- Real-time collision detection and player-object interactions
- Inventory system with backpack UI for collecting story items
- State management for game progression and item collection

**User Authentication System**: LocalStorage-based user management
- Registration with validation (username uniqueness, password strength)
- Login verification and session management
- Persistent user state across page navigation

## Game Design Concept

**Horror Theme**: Medical facility with dark red color scheme and eerie visual effects
**Core Mechanics** (conceptual - not yet implemented):
- Rule-based gameplay: Players discover and must follow/break hospital rules
- Memory conspiracy storyline: Illegal "memory factor" extraction experiments
- Multiple endings based on player choices
- Psychological horror focus (atmosphere over gore)

## Development Guidelines

### Code Style Conventions
- **CSS**: Uses BEM methodology for class naming
- **JavaScript**: ES6+ class-based architecture, camelCase naming
- **HTML**: Semantic tags, proper hierarchy
- **Comments**: Mixed Chinese/English, key logic must be documented

### Important Patterns to Follow

**Adding New Pages**:
1. Copy existing HTML structure template from `index.html` or `codes/` examples
2. Include `bgm-manager.js` script via `<script src="bgm-manager.js"></script>`
3. Add scroll-triggered animations with `.scroll-animate` classes
4. Use CSS custom properties for consistent theming (`--primary-color`, `--dark-red`, etc.)
5. Include navigation structure with proper `active` class
6. Test responsive behavior on mobile devices

**Adding New Game Chapters**:
1. Use HTML5 Canvas for interactive gameplay (see `part_1_1.html` as reference)
2. Implement character sprite animation system with predefined sequences
3. Include inventory/backpack system for story progression
4. Handle keyboard input (WASD/Arrow keys, Space for interaction)
5. Manage game state transitions between chapters

**BGM Integration**:
All pages must include BGM controls:
```html
<button id="bgmToggle" class="bgm-toggle">🔇</button>
<audio id="bgmAudio" loop preload="auto">
    <source src="audio/Home bgm.mp3" type="audio/mpeg">
</audio>
<script src="bgm-manager.js"></script>
```

**Game Development Patterns**:
```javascript
// Character animation system (from part_1_1.html)
const WALK_ANIMATION_SEQUENCE = ['walk1', 'walk2', 'walk1', 'walk3'];
const STAND_ANIMATION_SEQUENCE = ['stand1', 'stand2'];

// Inventory management pattern
const backpack = {
    items: [],
    maxItems: 16,
    hasNewItem: false
};

// Canvas game loop structure
function gameLoop(timestamp) {
    drawScene();
    drawPaperBall();
    updatePlayer();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}
```

## Current State & Limitations

**Present State**: Interactive game prototype with multiple chapters implemented
- Working authentication system with LocalStorage persistence
- Canvas-based gameplay with character animation and inventory system
- Multiple game chapters (prologue, part_1_1, part_1_2, part_2, endings)
- Team member showcase with individual profile pages
**Missing Assets**: Several background images and team member photos referenced but not present
**Audio Compatibility**: Only MP3 format provided (consider adding OGG for broader support)

**Future Development Areas**:
- Game engine integration (consider Phaser.js)
- Backend services if multiplayer features needed
- Enhanced mobile optimization (PWA)
- Extended audio system (sound effects, ambient audio)