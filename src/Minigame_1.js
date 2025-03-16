import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

import * as THREE from 'three'
import { Box } from '@react-three/drei'
import CameraRig from './entities/CameraRig'


export default function Minigame_1()
{
    const environment = useThree()

    useEffect(() =>{
        environment.scene.background = new THREE.Color("purple")
    },[])

    return <>
        <CameraRig />
        <Box material={new THREE.MeshBasicMaterial()} />
    </>
}