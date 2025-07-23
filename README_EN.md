# Angular Snake Game

**Language:** [中文](README.md) | [English](README_EN.md)

A modern Snake game built with Angular 20.1.0, featuring standalone components, signals, and reactive programming patterns.

## Features

- 🎮 **Modern Angular Architecture** - Using standalone components and Angular Signals
- 📱 **Responsive Design** - Support for desktop and mobile devices
- ⌨️ **Multiple Control Methods** - Keyboard (Arrow keys/WASD) and touch controls
- 🏆 **Scoring System** - Real-time score tracking and high score records
- 🎯 **Progressive Difficulty** - Game speed increases with level progression
- 🎨 **Modern UI** - Dark theme with gradients and animations
- 💾 **Data Persistence** - Local storage for high scores
- 🌐 **Chinese Interface** - Complete Chinese localization

## Project Structure

```
src/
├── app/
│   ├── components/          # Game components
│   │   ├── snake-game/      # Main game container component
│   │   ├── game-board/      # Canvas game board
│   │   ├── game-controls/   # Game control buttons
│   │   └── scoreboard/      # Score display panel
│   ├── models/              # Data models and interfaces
│   │   └── game.models.ts   # Game state, snake, food models
│   ├── services/            # Business logic services
│   │   ├── game.service.ts  # Core game logic
│   │   └── keyboard.service.ts # Keyboard input handling
│   ├── app.config.ts        # Application configuration
│   └── app.routes.ts        # Route configuration
└── styles.scss              # Global styles
```

## Tech Stack

- **Angular** 20.1.0 - Frontend framework
- **TypeScript** 5.8.2 - Type safety
- **RxJS** 7.8.0 - Reactive programming
- **SCSS** - Style preprocessor
- **HTML5 Canvas** - Game rendering

## Getting Started

### Prerequisites

- Node.js 18+ 
- Angular CLI 20.1.1+

### Installation

```bash
npm install
```

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/` to view the game. The app will automatically reload if you change any of the source files.

### Build

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Game Controls

### Keyboard Controls
- **Arrow Keys / WASD** - Control snake movement direction
- **Space / ESC** - Pause/Resume game
- **Enter** - Start game
- **R** - Restart game

### Mobile Controls
- **Direction Buttons** - On-screen touch controls
- **Control Buttons** - Start/Pause/Restart

## Core Features

### Game State Management
- Reactive state management using Angular Signals
- Game loop and event handling with RxJS

### Collision Detection
- Wall collision detection
- Snake self-collision detection
- Food collision detection

### Rendering System
- Efficient HTML5 Canvas rendering
- Grid layout system
- Snake head eyes and food highlight effects

### Responsive Design
- Mobile-first CSS design
- Touch-friendly control interface
- Adaptive canvas sizing

## Development

This project uses modern Angular development patterns:

- **Standalone Components** - No NgModule required
- **Signal System** - Replaces traditional Subject/Observable patterns
- **Input/Output Decorators** - Using new syntax
- **Type Safety** - Complete TypeScript type definitions

## License

MIT License

## Contributing

Issues and Pull Requests are welcome to improve this project.