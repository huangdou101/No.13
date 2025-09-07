# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ward No.13 (13号病房)** is a web-based horror escape game developed by a 6-student university team. This is currently a showcase website that demonstrates the game concept with plans for full game implementation.

## Development Commands

**This is a static HTML/CSS/JavaScript project with no build process.**

- **Local Development**: Open any HTML file directly in a browser (start with `index.html`)
- **Testing**: Manual testing in browser (no automated test framework)
- **Deployment**: Static hosting (GitHub Pages, Netlify, Vercel)
- **Game Development**: Canvas-based chapters in `codes/part_*.html` files
- **Audio Testing**: Ensure MP3 files in `audio/` folder are accessible

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
├── game-save-manager.js  # Automatic save/load system
├── codes/                # Game pages and core functionality
│   ├── login.html        # User login page
│   ├── register.html     # User registration page
│   ├── team.html         # Development team showcase
│   ├── prologue.html     # Game opening sequence
│   ├── part_1_1.html     # First game chapter (canvas-based)
│   ├── part_1_2.html     # Second game chapter (canvas-based)
│   ├── part_1_3.html     # Third game chapter continuation
│   ├── part_2.html       # Fourth game chapter (canvas-based)
│   ├── 转场1.html         # Transition scene between chapters
│   ├── Fifth-main.html   # Fifth chapter - story-driven dialogue system
│   ├── 拉*.html          # Additional story sequences (拉6, 拉7, etc.)
│   ├── nurse_dialogue.html # NPC interaction system
│   ├── endings.html      # Multiple game endings
│   └── [member].html     # Individual team member pages (lhl, wcr, wjp, wsy, wzx, zxn)
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

**BGM Manager**: Centralized audio management system (`bgm-manager.js`)
- Global `BGMManager` class with singleton pattern (`window.bgmManager`)
- Automatic initialization on `DOMContentLoaded` event
- Consistent UI state synchronization across all pages
- Error handling for audio playback failures
- Fixed position control button with hover animations and visual feedback

**Game Save System**: Automatic save/load functionality (`game-save-manager.js`)
- **Auto-Save**: Automatic saves every 30 seconds, on page unload, and chapter transitions
- **Multi-User Support**: Separate save slots for each registered user
- **Progress Tracking**: Saves player position, backpack items, chapter progress, and game flags
- **Save Management**: Up to 20 save points per user, automatic cleanup of old saves
- **Data Structure**: JSON-based saves in localStorage with timestamp and metadata
- **Recovery Features**: Import/export save data for backup and transfer

**Canvas-based Game System**: Interactive 2D gameplay using HTML5 Canvas
- **Character Animation**: Sprite-based system with predefined sequences:
  - `WALK_ANIMATION_SEQUENCE = ['walk1', 'walk2', 'walk1', 'walk3']`
  - `STAND_ANIMATION_SEQUENCE = ['stand1', 'stand2']`
  - Frame-based animation with configurable timing (`FRAME_DURATION`, `FRAMES_PER_IMAGE`)
- **Player Movement**: Keyboard input handling (WASD/Arrow keys) with direction-based sprite flipping
- **Interaction System**: Distance-based highlighting and interaction with objects (`INTERACTION_DISTANCE`, `HIGHLIGHT_DISTANCE`)
- **Inventory Management**: LocalStorage-persistent backpack system with item collection and display
- **Game State**: Chapter progression with seamless transitions between HTML pages

**Dialogue System**: Story-driven interactive narrative system (Fifth-main.html pattern)
- **Character Sprites**: Positioned sprite system with visibility controls (`#characterMe`, `#characterDoctor`)
- **Story Container**: Centralized text display with speaker identification and typewriter effects
- **Background Integration**: Full-screen background images with overlay gradients
- **Narrative Flow**: Sequential story progression with character positioning and dialogue timing
- **CSS Custom Properties**: Theme consistency using `--primary-color`, `--dark-red`, `--text-shadow` variables

**User Authentication System**: Client-side authentication using LocalStorage
- **User Storage**: JSON array in `localStorage.getItem('users')` with user objects
- **Session Management**: Current user stored in `localStorage.getItem('currentUser')`
- **Validation Logic**: Username uniqueness, password strength (min 6 chars), confirmation matching
- **Navigation Flow**: Login required for game access, automatic redirection based on auth state
- **Form UI**: Real-time validation with error message display and success animations

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
2. Include BGM manager: `<script src="../bgm-manager.js"></script>` (adjust path for subdirectories)
3. **Include Save Manager**: `<script src="../game-save-manager.js"></script>` for automatic save functionality
4. Add required BGM HTML elements:
   ```html
   <audio id="bgmAudio" loop preload="auto">
       <source src="../audio/Home bgm.mp3" type="audio/mpeg">
   </audio>
   <button id="bgmToggle" class="bgm-toggle">🔊</button>
   ```
5. Implement scroll animations: Add `.scroll-animate` classes and initialize with:
   ```javascript
   function handleScrollAnimation() {
       // Check isInViewport() and update .visible/.fade-out classes
   }
   window.addEventListener('scroll', throttle(handleScrollAnimation));
   ```
6. Use CSS custom properties: `--primary-color`, `--dark-red`, `--bg-dark`, `--text-light`, etc.
7. Include consistent navigation with proper `active` class highlighting
8. Add page transition effects with `.page-transition` class and opacity animations

**Adding New Game Chapters**:
1. **Canvas Setup**: Create 1450x818 canvas with proper image rendering:
   ```javascript
   const canvas = document.getElementById('gameCanvas');
   const ctx = canvas.getContext('2d');
   canvas.style.imageRendering = 'pixelated';
   ```
2. **Asset Management**: Preload all images in hidden div with IDs matching sprite names
3. **Animation System**: Use consistent animation constants and frame counters:
   ```javascript
   const TARGET_HEIGHT = 336; // Character height
   const WALK_SPEED = 13; // Movement speed
   const FRAME_DURATION = 80; // Animation timing
   ```
4. **Input Handling**: Implement keyboard state tracking with continuous movement
5. **Game Loop**: Use `requestAnimationFrame()` with frame duration control
6. **Inventory Integration**: Add items with `addToBackpack(id, name, imageSrc)`
7. **Chapter Transitions**: Handle scene changes via `window.location.href`

**Adding New Dialogue Scenes**:
1. **HTML Structure**: Use full-screen container pattern with `#gameContainer`, `#backgroundImage`, `#storyOverlay`
2. **Character Setup**: Position sprites with `.sprite` class, use `#characterMe` (left) and `#characterDoctor` (right) IDs
3. **Story Container**: Implement `#storyContainer` with `#speakerName` and `#storyText` elements
4. **CSS Variables**: Use consistent theming with `--primary-color: #8B0000`, `--dark-red: #5A0000`, `--text-shadow`
5. **Background Integration**: Apply `object-fit: cover` for full-screen backgrounds with gradient overlays
6. **Responsive Design**: Use viewport units (`vh`, `vw`) for consistent scaling across devices

**Chapter Transition Patterns**:
- **Direct Navigation**: Use `window.location.href = 'next-chapter.html'` for immediate transitions
- **Conditional Logic**: Implement branching narratives with player choice or item-based progression
- **State Preservation**: Ensure backpack and game state persist across chapter transitions
- **Asset Preloading**: Load next chapter assets during current chapter for seamless transitions

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
// Animation sequences and timing constants
const WALK_ANIMATION_SEQUENCE = ['walk1', 'walk2', 'walk1', 'walk3'];
const STAND_ANIMATION_SEQUENCE = ['stand1', 'stand2'];
const FRAME_DURATION = 80;
const INTERACTION_DISTANCE = 120;
const HIGHLIGHT_DISTANCE = 180;

// Player state management
const player = {
    x: canvas.width / 2, y: 0,
    width: 0, height: 0,
    direction: 'right', isMoving: false,
    walkCurrentFrame: 0, walkFrameCounter: 0
};

// Backpack system with UI integration
const backpack = { items: [], maxItems: 16, hasNewItem: false };
function addToBackpack(id, name, image) {
    // Add/update item, refresh UI, show notification
}

// Game loop with timing control
let lastTime = 0;
function gameLoop(timestamp) {
    if (timestamp - lastTime >= FRAME_DURATION) {
        drawScene(); updatePlayer(); drawPlayer();
        lastTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
}

// Save system usage patterns
// Proper backpack initialization pattern - call immediately after image preloading:
preloadImages().then(() => {
    // Initialize player dimensions
    player.width = images.walk1.naturalWidth * scaleRatio;
    player.height = TARGET_HEIGHT;
    player.y = canvas.height - player.height;
    
    // Initialize backpack system immediately (NO setTimeout)
    const backpackInitialized = initializeBackpackWithSavedData();
    if (!backpackInitialized) {
        console.log('Using empty backpack - game start');
    }
    
    // Start game loop
    requestAnimationFrame(gameLoop);
});

// Manual save trigger
function saveGameNow(customData = {}) {
    if (window.gameSaveManager) {
        return window.gameSaveManager.saveGame(customData);
    }
}
```

## Current Implementation Status

**Completed Features**:
- **Authentication Flow**: Full registration/login system with LocalStorage persistence
- **Auto-Save System**: Complete save/load functionality with 30-second intervals and chapter transitions
- **Game Engine**: Canvas-based 2D gameplay with sprite animation and collision detection
- **Chapter System**: Multiple game chapters with seamless transitions (prologue → part_1_1 → 转场1 → part_1_2 → part_1_3 → part_2 → Fifth-main)
- **Dialogue System**: Story-driven interactive narrative system with character sprites and typewriter effects
- **Inventory System**: Persistent backpack with cross-chapter item persistence
- **Progress Tracking**: User-specific save slots with chapter progress and game state persistence
- **Audio Management**: Global BGM system with consistent UI controls
- **Team Showcase**: Individual member pages with photo galleries
- **Visual System**: Scroll animations, page transitions, responsive design
- **Character Rendering**: Unified character display system with fallback blue rectangles
- **Narrative Branching**: Multiple story paths and interactive dialogue sequences

**Critical Issues and Solutions**:

**Character Rendering Problems**:
- **Issue**: Characters may disappear in part_1_2 and part_2
- **Cause**: Inconsistent image validation logic
- **Solution**: Use unified drawPlayer() pattern across all chapters:
```javascript
if (currentImage && (currentImage.tagName === 'CANVAS' || (currentImage.complete && currentImage.naturalWidth > 0))) {
    ctx.drawImage(currentImage, drawX, drawY, player.width, player.height);
} else {
    // Fallback blue rectangle with white eyes
    ctx.fillStyle = '#4a9eff';
    ctx.fillRect(drawX, drawY, player.width, player.height);
}
```

**Backpack Persistence Issues**:
- **Issue**: Backpack items lost between chapters
- **Cause**: Race conditions in initialization timing
- **Solution**: Call `initializeBackpackWithSavedData()` immediately after image preloading, NOT with setTimeout

**Text Display Issues**:
- **Issue**: Duplicate text in prologue typewriter effect
- **Cause**: Overlapping setTimeout calls
- **Solution**: Use proper timer management with clearTimeout() and state checking

**Asset Dependencies**:
- **Required Images**: Character sprites (walk1-3, stand1-2), background images, UI elements
- **Audio Files**: Currently MP3 only (`audio/Home bgm.mp3`)
- **Team Photos**: Individual member photos in `pictures/` folder

**Technical Limitations**:
- **Browser Compatibility**: HTML5 Canvas and ES6+ JavaScript required
- **Audio Support**: No fallback for browsers without MP3 support
- **Mobile Experience**: Canvas touch controls not implemented
- **Character Assets**: Character rendering depends on sprite image loading; fallback blue rectangles used when images fail
- **File Paths**: Uses relative paths that may break if files are moved

**Development Considerations**:
- **Performance**: Canvas rendering optimized for 60fps gameplay
- **Memory Management**: Image preloading prevents mid-game loading delays
- **Error Handling**: Graceful degradation when assets fail to load
- **Accessibility**: Keyboard-only navigation support implemented
- **Debugging**: Console warnings provided for asset loading failures and rendering issues