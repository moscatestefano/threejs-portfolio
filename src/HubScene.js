import Galaxy from './entities/Galaxy.js'
import HUD from './UI/HUD.js'
import CameraRig from './entities/CameraRig.js'

import { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Loader, Stats, StatsGl } from '@react-three/drei'


export default function HubScene() 
{
    return <>
        <Canvas
            camera={
            {
                fov: 45,
                near: 0.1,
                far: 75,
                position: [0, 4, -22],
                rotation: [Math.PI/4, 0, 0]
            }
            }
            gl={
            {
                toneMapping: THREE.ACESFilmicToneMapping
            }
            }  
            >  

            <CameraRig />
            <Suspense>
                <Galaxy />
            </Suspense>

            {/* DEBUG */}
            <Stats showPanel={0} className="stats" />
            <StatsGl className="stats" />
        </Canvas>

        <HUD />

        <Loader />
    </>
}