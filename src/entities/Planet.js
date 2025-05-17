import useSpaceLobby from '../stores/useSpaceLobby'

import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'

import planetJson from '../assets/text/en/planets.json'

// Margins of improvement

export default function Planet({ planetName, 
                                 galaxyFrom, 
                                 centerAt,
                                 distanceFromSun,
                                 cardinalOrder, 
                                 radius = 1,
                                 geometry })
{

    const [hovered, setHovered] = useState(false)

    // CONSTANTS

    const DIMINISHING_FACTOR = 0.45
    const ROTATION_SPEED = 0.25
    const REVOLUTION_SPEED = 0.3

    const rotationSpeedAdjusted = DIMINISHING_FACTOR / cardinalOrder * ROTATION_SPEED
    const revolutionSpeedAdjusted = DIMINISHING_FACTOR / cardinalOrder * REVOLUTION_SPEED

    // JSON INFO
    
    const planetProps = 
    {
        name: planetJson[galaxyFrom][planetName].name,
        project: planetJson[galaxyFrom][planetName].project,
        year: planetJson[galaxyFrom][planetName].year,
        client: planetJson[galaxyFrom][planetName].client,
        publisher: planetJson[galaxyFrom][planetName].publisher,
        link: planetJson[galaxyFrom][planetName].link,
        myRole: planetJson[galaxyFrom][planetName].myRole,
        elements: planetJson[galaxyFrom][planetName].elements,
        elementsTag: planetJson[galaxyFrom][planetName].elementsTag,
        flavor: planetJson[galaxyFrom][planetName].flavor,
        description: planetJson[galaxyFrom][planetName].description,
        minigameLink: planetJson[galaxyFrom][planetName].minigameLink
    }

    // TEXTURE AND MATERIAL

    const [
        colorMap,
        normalMap,
        roughnessMap,
      ] = useTexture([
        `./planet_models/${planetName}/Planet Color.jpg`,
        `./planet_models/${planetName}/Planet Normals.jpg`,
        `./planet_models/${planetName}/Planet Roughness.jpg`
        ])
    
    // REVOLUTION & ROTATION

    const isPlanetInspected = useSpaceLobby(state => state.planetInspected)
    const planet = useRef()
    const sunPivot = useRef()

    useFrame((state, delta) => {
        if (!isPlanetInspected) sunPivot.current.rotation.z += (revolutionSpeedAdjusted * delta)
        planet.current.rotation.y += (rotationSpeedAdjusted * delta)
    })

    return (
        <>
            <Suspense fallback={<PlanetWireframe position={[distanceFromSun, 0, 0]} rotation={[Math.PI/2,0,0]} scale={radius} geom={geometry} />}>
                <group ref={sunPivot} position={centerAt} rotation={[Math.PI/2, 0, 0]}>
                    <mesh ref={planet} 
                        position={[distanceFromSun, 0, 0]} 
                        rotation={[Math.PI/2,0,0]} 
                        scale={radius} 
                        onClick={(e) => {
                            e.stopPropagation()
                            useSpaceLobby.setState({ planetInspected: true, planetObjectRef: planet, currentPlanetProps: planetProps })
                            }
                        }
                        onPointerMissed={() => useSpaceLobby.setState({ planetInspected: false, planetObjectRef: undefined, currentPlanetProps: undefined })}
                        geometry={geometry}
                        onPointerEnter={(e) => {
                            e.stopPropagation() 
                            setHovered(true)
                            }
                        }
                        onPointerLeave={(e) => {
                            e.stopPropagation()
                            setHovered(false)
                            }
                        }
                        >
                            <meshStandardMaterial 
                                map={colorMap}
                                normalMap={normalMap}
                                roughnessMap={roughnessMap}
                            />
                            {hovered && <lineSegments scale={1.2}>
                                <edgesGeometry args={[geometry, 7]} />
                                <meshBasicMaterial color={"orange"} />
                            </lineSegments>}
                            <PlanetTagName name={planetProps.name} radius={radius} />
                    </mesh>
                </group>
            </Suspense>
            <Ring distanceFromSun={distanceFromSun} centerAt={centerAt} />
        </>
    )
}

function Ring({ distanceFromSun, centerAt })
{
    return (
        <group>
            <mesh rotation={[Math.PI/2, 0, 0]} position={centerAt}>
                <ringGeometry args={[distanceFromSun, distanceFromSun + 0.1, 32, 1, 0, Math.PI * 2]} />
                <meshBasicMaterial color="white" side={THREE.DoubleSide}/> 
            </mesh>
        </group>
    )
}

function PlanetTagName({name, radius})
{
    // This component duplicates an HTML element in order to be read at all rotations
    // Modify both when needed

    const [hidden, setHidden] = useState()
    const isPanelOpen = useSpaceLobby((state) => state.isPanelOpen)
    const isPlanetInspected = useSpaceLobby((state) => state.planetInspected)

    return (
        <>
            {!isPanelOpen && !isPlanetInspected && <Html
                position={[0,-radius-1,-0.01]}
                rotation={[Math.PI, 0, 0]}
                transform
                occlude
                onOcclude={setHidden}
                style={{ transition: 'all 0.2s', opacity: hidden ? 1 : 0, transform: `scale(${hidden ? 1 : 0.25})` }}
            >
                <div className='planetName'>
                    <p>{name}</p>
                </div>
            </Html>}
            {!isPanelOpen && !isPlanetInspected && <Html
                position={[0,-radius-1,0.01]}
                rotation={[Math.PI, Math.PI, 0]}
                transform
                occlude
                onOcclude={setHidden}
                style={{ transition: 'all 0.2s', opacity: hidden ? 1 : 0, transform: `scale(${hidden ? 1 : 0.25})` }}
            >
                <div className='planetName'>
                    <p>{name}</p>
                </div>
            </Html>}
        </>
    )
}

function PlanetWireframe({ startingPosition, rotation, scale, geometry })
{
    const wireMat = new THREE.MeshBasicMaterial()
    wireMat.wireframe = true

    return  <group position={startingPosition} rotation={rotation} scale={scale} dispose={null}>
                <mesh geometry={geometry} material={wireMat} />
            </group>
}