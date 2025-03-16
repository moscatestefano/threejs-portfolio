import SolarSystem from './SolarSystem'
import Spaceship from './Spaceship'

import { useEffect } from 'react';
import { CubeTextureLoader } from 'three'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Galaxy()
{
    const loader = new CubeTextureLoader();
    loader.setPath("cubemap/1")

    const environment = useThree()
    const sceneObj = []

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

    const { nodes } = useGLTF('./planet_models/planet.gltf')

    return (
        <group>
            <ambientLight color="white" intensity={2.5} />
            <SolarSystem name="ludicus IV" centerAt={[0,0,0]} geometry={nodes.Sphere001.geometry} />
            <SolarSystem name="port ecora" centerAt={[100,0,100]} geometry={nodes.Sphere001.geometry} />
            <Spaceship startingPosition={[-6, 2, 0]} />
        </group>
    )
}