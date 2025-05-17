import { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

import ExplosionEffect from './ExplosionEffect'

const Cannon = forwardRef((props, ref) => 
  {

  const { shotsLeft, gameState, selectedProjectileType, ...restProps } = props;

    const { nodes, materials } = useGLTF('./public/cannon.glb')
    const [explosion, setExplosion] = useState(null);

    // Refs for cannon parts
    const standRef = useRef()
    const cannonRef = useRef()
    const spawnPointRef = useRef()
    const projectilesRef = useRef([]);
    let explosionRadius = 15

    // Expose methods and refs to parent component
    useImperativeHandle(ref, () => ({
    rotateStand,
    elevateCannon,
    getSpawnPosition: () => {
        const position = new THREE.Vector3()
        spawnPointRef.current.getWorldPosition(position)
        return position
    },
    getCannonDirection: () => {
        const direction = new THREE.Vector3()
        cannonRef.current.getWorldDirection(direction)
        return direction
    },
    fireProjectile,
    // Direct access to parts if needed
    parts: {
        stand: standRef,
        cannon: cannonRef,
        spawnPoint: spawnPointRef
    }
    }))

    const fireProjectile = (shotsLeft, gameState, selectedProjectileType) => {
        if (shotsLeft <= 0 || gameState !== 'playing') return;
    
        const rotation = cannonRef.current.rotation;
        const direction = new THREE.Vector3(0, 0, 1)
          .applyEuler(new THREE.Euler(rotation[0], rotation[1], 0));
        
        // Base velocity adjusted by projectile type
        let velocity = 20;
        if (selectedProjectileType === 'HEAVY') velocity *= 0.8;
        if (selectedProjectileType === 'EXPLOSIVE') velocity *= 1.2;
    
        const projectile = {
          position: [0, 0, -5], // Cannon position
          velocity: direction.multiplyScalar(velocity).toArray(),
          type: selectedProjectileType,
          onCollide: (event) => {
            // Handle collision effects
            if (selectedProjectileType === 'EXPLOSIVE') {
              // Explosion effect
              setExplosion(event.contact.position);
            }
          }
        };
        
        projectilesRef.current.push(projectile);
      };
  const setShotsLeft = prev => {
          const remaining = prev - 1;
          if (remaining === 0) {
            // TODO Check game state after three seconds from the impact
            // setTimeout(() => handleGameEnd(), 1500);
          }
          return remaining;
        };

    // Rotation controls
  const rotateStand = angle => {
    if (standRef.current) {
      standRef.current.rotation.y += angle
    }
  }

  // Elevation controls
  const elevateCannon = angle => {
    if (cannonRef.current) {
      cannonRef.current.rotation.x = THREE.MathUtils.clamp(
        cannonRef.current.rotation.x + angle,
        -Math.PI/4, // -45 degrees
        Math.PI/4    // +45 degrees
      )
    }
  }

  return (
    <>
    <group ref={standRef} name="Stand">
      <mesh geometry={nodes.Stand.geometry} material={materials.metal} />
      <group ref={cannonRef} name="Cannon" position={[0, 0.5, 0]}>
        <mesh geometry={nodes.Cannon.geometry} material={materials.metal} />
        <group ref={spawnPointRef} name="SpawnPoint" position={[0, 0, 3]} />
      </group>
    </group>
    {explosion && (
    <ExplosionEffect
      position={explosion.position}
      radius={explosionRadius}
      onDone={() => setExplosion(null)}
    />
    )}
    </>
    )
})

useGLTF.preload('./public/cannon.glb')

export default Cannon