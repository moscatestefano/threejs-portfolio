import { Suspense } from 'react'
import * as THREE from 'three'
import { Float, useGLTF } from '@react-three/drei'

export default function Spaceship({ startingPosition, ...props })
{
    const {nodes, materials} = useGLTF('./spaceship.gltf')

    return <>
    <Suspense fallback={<SpaceshipWireframe nodes={nodes} pos={startingPosition} rot={[0, Math.PI / 2, 0]} />}>
        <Float position={startingPosition} floatIntensity={2} rotationIntensity={0.1} speed={3} scale={0.3} rotation={[0, Math.PI / 2, 0]} >
            <group props={props} dispose={null}>
                <mesh geometry={nodes.Cube005.geometry} material={materials.Mat0} />
                <mesh geometry={nodes.Cube005_1.geometry} material={materials.Mat1} />
                <mesh geometry={nodes.Cube005_2.geometry} material={materials.Mat2} />
                <mesh geometry={nodes.Cube005_3.geometry} material={materials.Window_Frame} />
                <mesh geometry={nodes.Cube005_4.geometry} material={materials.Mat4} />
                <mesh geometry={nodes.Cube005_5.geometry} material={materials.Mat3} />
                <mesh geometry={nodes.Cube005_6.geometry} material={materials.Window} />
            </group>
        </Float>
    </Suspense>
    </>
}

function SpaceshipWireframe({ nodes, startingPosition, rotation })
{
    const wireMat = new THREE.MeshBasicMaterial()
    wireMat.wireframe = true

    return  <group position={startingPosition} rotation={rotation} dispose={null}>
                <mesh geometry={nodes.Cube005.geometry} material={wireMat} />
                <mesh geometry={nodes.Cube005_1.geometry} material={wireMat} />
                <mesh geometry={nodes.Cube005_2.geometry} material={wireMat} />
                <mesh geometry={nodes.Cube005_3.geometry} material={wireMat} />
                <mesh geometry={nodes.Cube005_4.geometry} material={wireMat} />
                <mesh geometry={nodes.Cube005_5.geometry} material={wireMat} />
                <mesh geometry={nodes.Cube005_6.geometry} material={wireMat} />
            </group>
}