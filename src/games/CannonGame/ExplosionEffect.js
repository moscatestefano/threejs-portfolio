import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const ExplosionEffect = ({ position = [0, 0, 0], radius = 3, duration = 1, onDone }) => {

  const pointsRef = useRef()
  const startTime = useRef(null)

  useEffect(() => {
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * radius
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i * 3] = position[0] + r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = position[1] + r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = position[2] + r * Math.cos(phi)
    }

    pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  }, [position, radius])

  useFrame((state) => {
    if (!startTime.current) startTime.current = state.clock.getElapsedTime()

    const elapsed = state.clock.getElapsedTime() - startTime.current
    if (elapsed > duration && onDone) onDone()
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial 
        color="#ff4400" 
        size={0.1} 
        blending={THREE.AdditiveBlending} 
        transparent 
      />
    </points>
  )
}

export default ExplosionEffect