import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon';
import { create } from 'zustand';
import { useLocation } from 'wouter'

import CubePyramid from './CubePyramid.js'
import Cannon from './Cannon.js';
import Platform from './Platform.js';
import Projectile from './Projectile.js';
import ProjectileSelector from './ProjectileSelector.js'
import ScoreDisplay from './ScoreDisplay.js'

// CONSTANTS
export const NUMBER_OF_SHOTS = 4

export const GAME_STATES = {
  playing: 'playing',
  won: 'won', 
  lost: 'lost'
}

export const PROJECTILE_TYPES = {
  NORMAL: {
    mass: 2.5,
    radius: 0.3,
    color: '#000000',
    label: 'Normal'
  },
  HEAVY: {
    mass: 5,
    radius: 0.4,
    color: '#4a4a4a',
    label: 'Heavy'
  },
  EXPLOSIVE: {
    mass: 0.7,
    radius: 0.25,
    color: '#ff0000',
    label: 'Explosive',
    explosionRadius: 3,
    explosionForce: 275
  }
};

// STORE
const useGameStore = create((set) => ({
  score: 0,
  highScore: parseInt(localStorage.getItem('cannonGameHighScore') || '0'),
  incrementScore: () => set(state => {
    const newScore = state.score + 1
    const newHighScore = Math.max(newScore, state.highScore)
    localStorage.setItem('cannonGameHighScore', newHighScore.toString())
    return { score: newScore, highScore: newHighScore }
  }),
  resetScore: () => set({ score: 0 })
}));

export default function CannonGame() {

  const sceneRef = useRef()
  const cannonRef = useRef()
  const isDraggingRef = useRef(false)
  const previousMouseRef = useRef({ x: 0, y: 0 })
  const [gameState, setGameState] = useState(GAME_STATES.playing)
  const [selectedProjectileType, setSelectedProjectileType] = useState('NORMAL')
  const [shotsLeft, setShotsLeft] = useState(NUMBER_OF_SHOTS)
  const [projectiles, setProjectiles] = useState([])
  const [pyramidKey, setPyramidKey ] = useState(0)
  const cubePositionsRef = useRef([])
  const cubePhysicalApi = useRef([])
  const totalCubes = useRef(10)
  const { score, incrementScore, resetScore } = useGameStore()
  
  const [ location, setLocation ] = useLocation()
  
  async function checkPyramidDestroyed()
  {
    let count = 0

    const cubeApis = cubePhysicalApi?.current || []
    const promises = cubeApis.map(api => {
      return new Promise(resolve => {
        const unsubscribe = api.position.subscribe(pos => {
          const latestCubeY = pos[1]

          if (latestCubeY <= 0)
            count++

          unsubscribe()
          resolve()
        })
      })
    })

    await Promise.all(promises)
    console.log(count, "/", totalCubes.current)

    return count >= totalCubes.current
  }

  useEffect(() => {

    const timeoutID = setTimeout(async () => {
      const isDestroyed = await checkPyramidDestroyed()
      console.log(isDestroyed)
      if (isDestroyed)
      {        
        setGameState(GAME_STATES.won)
        incrementScore()
      } else if (shotsLeft === 0) {
        setGameState(GAME_STATES.lost)
        resetScore()
      }
    }, 4000)
    return () => clearTimeout(timeoutID)
  }, [shotsLeft])

  const gameOver = () => {
    setShotsLeft(NUMBER_OF_SHOTS);
    setGameState(GAME_STATES.playing);
    
    setProjectiles([])
    cubePositionsRef.current = []
    totalCubes.current = 10
    cubePhysicalApi.current = cubePhysicalApi.current.slice(0,10)
    setPyramidKey(prev => prev + 1)
        // Reset cube positions to their original arrangement
    const levels = 4 + Math.floor(score / 5);
    let cubeIndex = 0;
    let cubeCount = 0

    for (let level = 0; level < levels; level++) {
      const cubesInLevel = levels - level;
      cubeCount += cubesInLevel
      const y = level * 1.1;

        for (let i = 0; i < cubesInLevel; i++) {
          const x = (i - (cubesInLevel - 1) / 2) * 1.1;
          const z = 5;

          const cubeApi = cubePhysicalApi.current[cubeIndex];
          if (cubeApi) {
            cubeApi.position.set(x, y, z);
            cubeApi.velocity.set(0, 0, 0);
            cubeApi.angularVelocity.set(0, 0, 0);
            cubeApi.rotation.set(0, 0, 0);
          }

          cubeIndex++;
        }
      }
  }
  
  const resetGame = () => {
    setShotsLeft(NUMBER_OF_SHOTS);
    setGameState(GAME_STATES.playing);
    
    setProjectiles([])
    cubePositionsRef.current = []
    setPyramidKey(prev => prev + 1)

    // Reset cube positions to their original arrangement
    const levels = 4 + Math.floor(score / 5);
    let cubeIndex = 0;
    let cubeCount = 0

    for (let level = 0; level < levels; level++) {
      const cubesInLevel = levels - level;
      cubeCount += cubesInLevel
      const y = level * 1.1;

        for (let i = 0; i < cubesInLevel; i++) {
          const x = (i - (cubesInLevel - 1) / 2) * 1.1;
          const z = 5;

          const cubeApi = cubePhysicalApi.current[cubeIndex];
          if (cubeApi) {
            cubeApi.position.set(x, y, z);
            cubeApi.velocity.set(0, 0, 0); // Stop motion
            cubeApi.angularVelocity.set(0, 0, 0);
            cubeApi.rotation.set(0, 0, 0);
          }

          cubeIndex++;
        }
      }
      totalCubes.current = score === 0 || score === undefined ? 10 : cubeCount
  }

  const handleFire = (projectileData) => {
    setProjectiles(prev => [...prev, projectileData])
    setShotsLeft(prev => prev - 1)
  }

  const registerPhysicalCube = api => {
    cubePhysicalApi.current.push(api)
  }

  // Mouse/Touch controls
  useEffect(() => {
    const handleStart = event => {
      isDraggingRef.current = true;
      const pos = getEventPosition(event);
      previousMouseRef.current = pos;
    };

    const handleMove = event => {
      if (!isDraggingRef.current || !cannonRef.current) return;
      
      const pos = getEventPosition(event);
      const deltaX = pos.x - previousMouseRef.current.x;
      const deltaY = pos.y - previousMouseRef.current.y;

      // Imperative handles
      cannonRef?.current.rotateStand(deltaX * 0.01) // Left/Right, clamped within Cannon.js
      cannonRef?.current.elevateCannon(-deltaY * 0.01) // Up/Down, clamped within Cannon.js

      previousMouseRef.current = pos;
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
    };

    const getEventPosition = event => {
      if (event.touches && event.touches[0])
        return { x: event.touches[0].clientX, y: event.touches[0].clientY }

      return { x: event.clientX, y: event.clientY}
    };

    // Event listeners
    document.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchstart', handleStart);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleStart);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      
      // TODO Geometries and materials cleanup
      // sceneRef?.current.forEach((element, i) => {
      //     element.geometry.dispose()
      //     element.material.dispose()
      // });
    };
  }, []);

  return (
    <>
      <Canvas
          ref={sceneRef}
          style={{background: '#202020'}}
          camera={{
              fov: 45,
              near: 0.1,
              far: 100,
              position: [-2, 2, -6]
          }}
          onCreated={({ camera }) => 
            camera.lookAt(0,0,0)
          }
          >  
          <ambientLight color="white" intensity={0.5} />
          <directionalLight color="white" intensity={1.5} castShadow position={[5,10,15]} />
          <Physics>
            <Platform position={[0,-2,0]} />
            <CubePyramid
              pyramidKey={pyramidKey}
              cubePositionsRef={cubePositionsRef}
              totalCubes={totalCubes} 
              cubePhysicalApi={registerPhysicalCube}
              score={score}
            />
            <Cannon 
              ref={cannonRef} 
              shotsLeft={shotsLeft} 
              gameState={gameState} 
              selectedProjectileType={selectedProjectileType}
              onFire={handleFire}
            />
            {/* <CannonImportTry /> */}
            {
              projectiles.map((proj, index) => {
                return (
                <Projectile 
                  key={index} 
                  position={proj.position} 
                  velocity={proj.velocity} 
                  type={proj.type} 
                  onCollide={proj.onCollide} 
                  cubePhysicalApi={cubePhysicalApi}
                />)
              })
            }
          </Physics>
      </Canvas>
      <div>
        <ScoreDisplay gameStore={useGameStore}/>
        <ProjectileSelector 
          selectedType={selectedProjectileType}
          onSelect={setSelectedProjectileType}
          shotsLeft={shotsLeft}
          PROJECTILE_TYPES={PROJECTILE_TYPES}
        />
        
        {/* Game state messages */}
        {gameState !== GAME_STATES.playing && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h2>{gameState === GAME_STATES.won ? 'Victory!' : 'Game Over'}</h2>
            <p>{gameState === GAME_STATES.won 
              ? 'You destroyed the pyramid! +1 point' 
              : 'You failed to destroy the pyramid. Score reset.'}
            </p>
            <button 
              onClick={gameState === GAME_STATES.won ? resetGame : gameOver}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                marginTop: '10px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              Play Again
            </button>
            <button 
              onClick={(e) => setLocation("/")}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                marginTop: '10px',
                cursor: 'pointer'
              }}
            >
              Main Hub
            </button>
          </div>
        )}

        {/* Fire button */}
        <button 
          onClick={() => cannonRef?.current.fireProjectile()}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            fontSize: '18px',
            backgroundColor: shotsLeft > 0 && gameState === GAME_STATES.playing ? '#4CAF50' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: shotsLeft > 0 && gameState === GAME_STATES.playing ? 'pointer' : 'not-allowed'
          }}
          disabled={shotsLeft <= 0 || gameState !== GAME_STATES.playing}
        >
          Fire!
        </button>
      </div>
    </>
  );
} 