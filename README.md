# Stefano Moscatelli's Portfolio Website with Interactive 3D Space

A unique portfolio website featuring an interactive 3D space environment with multiple solar systems and minigames. Built with React, Three.js, and modern web technologies.

## Features

### 3D Space Environment
- Interactive 3D space with multiple solar systems
- Dynamic camera controls and navigation
- Realistic lighting and environment mapping
- Smooth transitions between solar systems

### Solar Systems
- **Ludicus IV**: First solar system with its own set of planets
- **Port Ecora**: Second solar system with unique planets
- Dynamic system switching with visual feedback
- Persistent state management across system changes

### UI Components
- **System Selector**: Toggle between solar systems
- **Planet Side Panel**: Display planet information and minigame access
- **Lore Panel**: Show detailed planet descriptions
- **Info Menu**: Credits and a bit of lore about who I am

## Technical Stack

### Core Technologies
- React
- Three.js
- @react-three/fiber
- @react-three/drei
- @react-three/cannon
- Zustand (State Management)
- Wouter (routing)

### Key Components

#### State Management
```javascript
// useSpaceLobby Store
{
    isPanelOpen: boolean,
    planetInspected: boolean,
    currentSolarSystem: string,
    lastActiveMinigame: string,
    // ... and other state properties
}
```

#### Solar System Configuration
```javascript
const SOLAR_SYSTEMS = {
    'ludicus IV': {
        position: [0, 0, 0],
        spaceshipStart: [-6, 2, 0]
    },
    'port ecora': {
        position: [100, 0, 100],
        spaceshipStart: [94, 2, 100]
    }
};
```

## Project Structure

```
src/
├── assets/
│   ├── text/
│   │   └── en/
|   |       └── planets.json
│   │       └── ui.json
│   └── cubemap/
├── components/
│   ├── entities/
│   │   ├── CameraRig.js
│   │   ├── Galaxy.js
│   │   ├── Planet.js
│   │   ├── SolarSystem.js
│   │   └── Spaceship.js
│   └── UI/
│       ├── DynamicMail.js
│       ├── GeneralInfoPanel.js
│       ├── HUD.js
│       ├── SystemSelector.js
│       ├── PlanetSidePanel.js
│       ├── PleaseRotate.js
│       └── LorePanel.js
├── games/
└── stores/
    └── useSpaceLobby.js
```

## State Management

### Solar System State
- Tracks current solar system
- Manages system transitions
- Handles minigame return states

## Final result

You can view the website @ [stefanomoscatelli.dev](https://stefanomoscatelli.dev "The journey of a 3D spaceman").