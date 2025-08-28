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
├── *.html           # 4 main pages (index, login, register, team)
├── bgm-manager.js   # Audio management module  
└── audio/           # Audio assets
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
1. Copy existing HTML structure template
2. Include `bgm-manager.js` script
3. Add scroll-triggered animations with `.scroll-animate` classes
4. Use CSS custom properties for consistent theming
5. Test responsive behavior on mobile

**BGM Integration**:
All pages must include BGM controls:
```html
<button id="bgmToggle" class="bgm-toggle">🔇</button>
<audio id="bgmAudio" loop preload="auto">
    <source src="audio/Home bgm.mp3" type="audio/mpeg">
</audio>
<script src="bgm-manager.js"></script>
```

**Scroll Animation Pattern**:
```javascript
// Viewport detection + throttled optimization
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('visible');
        }
    });
}
```

## Current State & Limitations

**Present State**: Showcase website only - core game mechanics not implemented
**Missing Assets**: Several background images and team member photos referenced but not present
**Audio Compatibility**: Only MP3 format provided (consider adding OGG for broader support)

**Future Development Areas**:
- Game engine integration (consider Phaser.js)
- Backend services if multiplayer features needed
- Enhanced mobile optimization (PWA)
- Extended audio system (sound effects, ambient audio)