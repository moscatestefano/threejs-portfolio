import useSpaceLobby from '../stores/useSpaceLobby'

import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'

import { hyperSpeedStarted, hyperSpeedFinished } from '../events/customEvents'


export default function CameraRig({pos = [0, 4, -22] })
{
    // DEBUG
    // const { vectorOffset } = useControls({ 
    //                                         vectorOffset: [0.6, 1.5, 5]
    //                                     })
    const vectorOffset = [0.6, 1.5, 5]


    const objectFocused = useSpaceLobby(state => state.planetObjectRef)
    const currentPlanetProps = useSpaceLobby(state => state.currentPlanetProps)
    const isSwitchToggled = useSpaceLobby(state => state.isSwitchToggled)
    
    const {camera, controls} = useThree()

    const zoomIn = (event) => {
        controls?.zoomTo(0.001, true)
        useSpaceLobby.setState({ isJumping: true })
    }
    const zoomOut = (event) => {
        controls?.zoomTo(1, true)
        setTimeout(() => {
            useSpaceLobby.setState({ isJumping: false })
        }, 500)
    }

    document.addEventListener('jumpStarted', (e) => zoomIn(e), {once: true})
    document.addEventListener('jumpFinished', (e) => zoomOut(e), {once: true})

    useEffect(() => {
        if (controls)
        {
            const newPos = objectFocused ? 
                esteemDistanceOnCircle(
                    objectFocused.current.position.x, 
                    objectFocused.current.parent.rotation.z,
                    currentPlanetProps.center) :
                new THREE.Vector3(...pos)
            const camPos = [newPos.x + vectorOffset[0], newPos.y + vectorOffset[1], newPos.z + vectorOffset[2]]
            objectFocused ? 
                controls.setTarget(...newPos, true) :
                controls.setTarget(0, 0, 0, true)
            objectFocused ?
                controls.setLookAt(camPos[0], camPos[1], camPos[2], ...newPos, true) :
                controls.setLookAt(0, 4, -22, 0, 0, 0, true)
            // objectFocused ?
            // controls.lerpLookAt(0, 4, -15, 0, 0, 0, newPos.x, newPos.y, newPos.z, newPos.x, newPos.y, newPos.z, 0.85, true) :
            // controls.lerpLookAt(newPos.x, newPos.y, newPos.z, newPos.x, newPos.y, newPos.z, 0, 4, -15, 0, 0, 0, 1, true)
        }
    }, [objectFocused])

    useEffect(() =>
    {
        if (controls)
        {
            document.dispatchEvent(hyperSpeedStarted)
            clearTimeout(clearZoom)
            clearZoom()
        }
    }, [isSwitchToggled])

    const clearZoom = () => 
    {
        setTimeout(() => {
            document.dispatchEvent(hyperSpeedFinished)
            }, 1500)
    }

    function esteemDistanceOnCircle(objectStartingXPos, angle, center)
    {
        // Uncomment 'center' if needed for calculations
        const esteem =
        {
            x: (objectStartingXPos * Math.sin(angle)), // + center[0],
            z: (objectStartingXPos * Math.cos(angle)) // + center[2]
        }

        return new THREE.Vector3(esteem.z, 0, esteem.x)
    }

    return <CameraControls makeDefault />
}