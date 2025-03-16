import Minigame_1 from './Minigame_1'

import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'

import { Link } from 'wouter'

export default function CannonMinigame()
{    
    return <>
    <Canvas>
        <Minigame_1 />
        <Loader />
    </Canvas>
    <Link to="/">GO BACK TO START</Link> {/* outside canvas */}
    </>
}