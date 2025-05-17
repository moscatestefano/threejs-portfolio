import SolarSystem from './SolarSystem'
import Spaceship from './Spaceship'
import useSpaceLobby from '../stores/useSpaceLobby';

import { useEffect } from 'react';
import { CubeTextureLoader } from 'three'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

// Solar systems base configurations

const SOLAR_SYSTEMS = {
    'ludicus IV': {
        position: [0, 0, 0],
        spaceshipStart: [-6, 2, 0]
    },
    'port ecora': {
        position: [100, 0, 100],
        spaceshipStart: [94, 2, 100]
    }
}

export default function Galaxy()
{
    const loader = new CubeTextureLoader();
    loader.setPath("cubemap/1")

    const environment = useThree()
    const sceneObj = []

    const currentSolarSystem = useSpaceLobby(state => state.currentSolarSystem)
    const lastActiveMinigame = useSpaceLobby(state => state.lastActiveMinigame)

    useEffect(() => {
        const texture = loader.load([
            "/px.jpg",
            "/nx.jpg",
            "/py.jpg",
            "/ny.jpg",
            "/pz.jpg",
            "/nz.jpg"
          ])
          environment.scene.background = texture

          environment.scene.traverse( obj => {
            if (obj.isMesh)
                sceneObj.push(obj)
          })
          

          return () =>  {        
            
            sceneObj.forEach((element, i) => {
                element.geometry.dispose()
                element.material.dispose()
            });

            // DEBUG CALL
            // console.log("After cleanup ", environment.gl.info)
          }
    }, [])

    useEffect(() => {
        if (lastActiveMinigame) {
            const minigameToSystemMapping = {
                'tubes': 'ludicus IV',
                'ghost': 'ludicus IV',
                'claw': 'port ecora',
                'cannon': 'ludicus IV,',
                null: 'ludicus IV'
                // TODO compile as games are pushed to prod
            }

            const targetSystem = minigameToSystemMapping[lastActiveMinigame]
            if (targetSystem)
                useSpaceLobby.getState().setCurrentSolarSystem(targetSystem)
        }
    }, [lastActiveMinigame])

    const { nodes } = useGLTF('./planet_models/planet.gltf')

    return (
        <group>
            <ambientLight color="white" intensity={2.5} />
            <SolarSystem name="ludicus IV" centerAt={SOLAR_SYSTEMS['ludicus IV'].position} geometry={nodes.Sphere001.geometry} />
            <SolarSystem name="port ecora" centerAt={SOLAR_SYSTEMS['port ecora'].position} geometry={nodes.Sphere001.geometry} />
            <Spaceship startingPosition={SOLAR_SYSTEMS[currentSolarSystem].spaceshipStart} />
        </group>
    )
}