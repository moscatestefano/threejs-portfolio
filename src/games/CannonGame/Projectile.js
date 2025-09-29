import * as THREE from 'three'
import { useState } from 'react';
import { useSphere } from "@react-three/cannon";

import ExplosionEffect from './ExplosionEffect.js';
import { PROJECTILE_TYPES } from "./CannonGame.js"

export default function Projectile({ position, velocity, type, onCollide, cubePhysicalApi })
{

  const [explosion, setExplosion] = useState(null)

  const [ref, api] = useSphere(() => ({
    mass: PROJECTILE_TYPES[type].mass,
    position,
    velocity,
    args: [PROJECTILE_TYPES[type].radius],
    onCollide: (e) => {
      if (type === 'EXPLOSIVE') {
        let impactPosition = e?.contact?.position
        if (e.body.userData.type !== 'cube') return

        if (!impactPosition && ref.current)
        {
          const fallback = new THREE.Vector3
          ref.current.getWorldPosition(fallback)
          impactPosition = fallback
        }

        handleExplosion(impactPosition);
      }
      onCollide?.(e);
    }
  }));

  // Function to handle explosion physics
  const handleExplosion = impactPosition => {
    const explosionPos = new THREE.Vector3(...impactPosition);
    const { explosionRadius, explosionForce } = PROJECTILE_TYPES.EXPLOSIVE;

    cubePhysicalApi?.current.forEach(api => {
      let latestCubePos = [0, 0, 0]
      const unsubscribe = api.position.subscribe(pos => {
        latestCubePos = pos
        
        
        const cubePos = new THREE.Vector3(...latestCubePos)
        const distance = explosionPos.distanceTo(cubePos)

        if (distance <= explosionRadius)
        {
          const forceMag = (1 - distance / explosionRadius) * explosionForce
          const direction = cubePos.clone().sub(explosionPos).normalize()
          const forceVec = direction.multiplyScalar(forceMag)
          const negativeForceVec = forceVec.negate()
          api.applyForce(forceVec.toArray(), latestCubePos)
        }
        
        setExplosion({ position: [...impactPosition]})
        unsubscribe()
      })
    })
    setTimeout(() => {
      api.position.set(-100,-100,-100)
    }, 150)
  }

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[PROJECTILE_TYPES[type].radius, 32, 32]} />
      <meshStandardMaterial color={PROJECTILE_TYPES[type].color} />
      {type === 'EXPLOSIVE' && (
        <pointLight
          color="#ff4400"
          intensity={0.5}
          distance={1}
        />
      )}
    {explosion && 
    <ExplosionEffect 
      position={explosion.position}
      radius={PROJECTILE_TYPES.EXPLOSIVE.explosionRadius}
      onDone={() => setExplosion(null)}
      />}
    </mesh>
  )
}