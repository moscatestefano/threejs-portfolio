import useSpaceLobby from '../stores/useSpaceLobby'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useTexture, Text3D } from "@react-three/drei"

import Planet from './Planet'
import planetJson from '../assets/text/en/planets.json'

function SolarSystem({ name, centerAt, geometry })
{   
    const solarSystemReference = useRef()
    const isSwitchToggled = useSpaceLobby(state => state.isSwitchToggled)

    const solarSystemName = planetJson[name].name
    const isEcora = name === "port ecora"

    useEffect(() => {
        clearTimeout(switchSolarSystems)
        switchSolarSystems()
    }, [isSwitchToggled])

    const switchSolarSystems = () => {
        setTimeout(() => {
        if (!isSwitchToggled)
        {
            if (centerAt[0] === 0 && centerAt[2] === 0)
            {
                solarSystemReference.current.position.set(0,0,0)
            }
            else if (centerAt[0] === 100)
            {
                solarSystemReference.current.position.set(25,0,25)
            }
        }
        else
        {
            if (centerAt[0] === 0 && centerAt[2] === 0)
            {
                solarSystemReference.current.position.set(100,0,100)
            }
            else if (centerAt[0] === 100)
            {
                solarSystemReference.current.position.set(-100,0,-100)
            }
        }}, 1000)
    }

    return (<>
        {!isEcora && <group ref={solarSystemReference}>
            <Sun hoverName={solarSystemName} position={centerAt} isEcora={isEcora} geometry={geometry} />
            <Planet planetName={"ban'lonnac"} galaxyFrom={name} centerAt={centerAt} cardinalOrder={1} distanceFromSun={4} radius={0.5} geometry={geometry} />
            <Planet planetName={"makkuro"} galaxyFrom={name} centerAt={centerAt} cardinalOrder={2} distanceFromSun={7} radius={0.8} geometry={geometry} />
            <Planet planetName={"nobonia"} galaxyFrom={name} centerAt={centerAt} cardinalOrder={3} distanceFromSun={10} radius={0.8} geometry={geometry} />
            <Planet planetName={"boros"} galaxyFrom={name} centerAt={centerAt} cardinalOrder={4} distanceFromSun={13} radius={1} geometry={geometry} />
        </group>}
        {isEcora && <group ref={solarSystemReference}>
            <Sun hoverName={solarSystemName} position={centerAt} isEcora={isEcora} geometry={geometry} />
            <Planet planetName={"exo"} galaxyFrom={name} centerAt={centerAt} cardinalOrder={1} distanceFromSun={4} radius={0.9} geometry={geometry} />
            <Planet planetName={"trantor"} galaxyFrom={name} centerAt={centerAt} cardinalOrder={2} distanceFromSun={7} radius={1} geometry={geometry} />
        </group>}
        </>
    )
}

function Sun({ hoverName, position, isEcora, geometry })
{
    const adjustedpath = isEcora ? "ecora" : "ludicus"

    // TEXTURE AND MATERIAL
    const [
        colorMap,
        normalMap,
        roughnessMap,
        emissiveMap
      ] = useTexture([
            `./planet_models/sun ${adjustedpath}/Sun Color.jpg`,
            `./planet_models/sun ecora/Sun Normals.jpg`,
            `./planet_models/sun ecora/Sun Roughness.jpg`,
            `./planet_models/sun ${adjustedpath}/Sun Emit.jpg`
        ])
        
    return (
        <group position={[position[0], 0, position[2]]} scale={1.2}>
            <Text3D font={"./fonts/MgOpenModata_Regular.json"} rotation={[0, Math.PI + Math.PI / 8 , 0]} position={[7, 3, 0]}>
                {hoverName}
                <meshBasicMaterial color="white" />
            </Text3D>
            <mesh geometry={geometry}>
                <meshStandardMaterial 
                    map={colorMap}
                    normalMap={normalMap}
                    roughnessMap={roughnessMap} 
                    emissive={isEcora ? "blue" : "red" }
                    emissiveMap={emissiveMap}
                    emissiveIntensity={0.5}
                />
            </mesh>
            <pointLight intensity={5} color="lightblue" />
        </group>
    )
}

export default SolarSystem