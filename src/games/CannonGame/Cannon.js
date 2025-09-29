import { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const Cannon = forwardRef((props, ref) => 
{

  const { shotsLeft, gameState, selectedProjectileType, onFire, ...restProps } = props;

    const { nodes, materials } = useGLTF('/gltfcannon.glb')
    const [explosion, setExplosion] = useState(null);

    // Refs for cannon parts
    const standRef = useRef()
    const cannonRef = useRef()
    const spawnPointRef = useRef()

    // Expose methods and refs to parent component
    useImperativeHandle(ref, () => ({
    rotateStand,
    elevateCannon,
    fireProjectile,
    // Direct access to parts if needed
    parts: {
        stand: standRef,
        cannon: cannonRef,
        spawnPoint: spawnPointRef
    }
    }))

    const fireProjectile = () => {
        if (shotsLeft <= 0 || gameState !== 'playing') return;
    
        const direction = new THREE.Vector3(0, 0, 1)
        cannonRef.current.getWorldDirection(direction)

        const spawnPosition = new THREE.Vector3
        spawnPointRef.current.getWorldPosition(spawnPosition)
        
        // Base velocity adjusted by projectile type
        let velocityScalar = 20;
        if (selectedProjectileType === 'NORMAL') velocityScalar *= 2.2
        if (selectedProjectileType === 'HEAVY') velocityScalar *= 1.2
        if (selectedProjectileType === 'EXPLOSIVE') velocityScalar *= 1.5

        const velocity = direction.multiplyScalar(velocityScalar).negate().toArray()
    
        const projectile = {
          position: spawnPosition.toArray(),
          velocity,
          type: selectedProjectileType
        }
        
        onFire?.(projectile)
      }

    // Rotation controls
  const rotateStand = angle => {
    if (standRef.current) {
      standRef.current.rotation.y -= angle * 1.5
      standRef.current.rotation.y = THREE.MathUtils.clamp(
        standRef.current.rotation.y + angle,
        -Math.PI / 3,
        Math.PI / 3
      )
    }
  }

  // Elevation controls
  const elevateCannon = angle => {
    if (cannonRef.current) {
      cannonRef.current.rotation.x = THREE.MathUtils.clamp(
        cannonRef.current.rotation.x + angle,
        -Math.PI/4,
        Math.PI/4 
      )
    }
  }

  return (
    <>
    <group {...props} dispose={null}>
      <group position={[0.015, -0.55, -3.059]} rotation={[0, Math.PI, 0]}>
        <mesh ref={standRef} geometry={nodes.cannon_1.geometry} material={materials.iron} > 
          <mesh geometry={nodes.cannon_2.geometry} material={materials['wood.004']} />
          <mesh ref={cannonRef} geometry={nodes.barrel.geometry} material={materials.iron} position={[0, 0.283, -0.067]} rotation={[Math.PI/4,0,0]}>
              <mesh ref={spawnPointRef} geometry={nodes.spawn.geometry} position={[-0.015, 0.005, -0.415]} scale={0.001} />
          </mesh>
        </mesh>
      </group>
    </group>
    </>
  )
})

useGLTF.preload('/gltfcannon.glb')

export default Cannon