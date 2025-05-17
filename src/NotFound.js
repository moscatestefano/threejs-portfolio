import { Canvas } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import { Link } from 'wouter'

import uiJson from './assets/text/en/ui.json'

export default function NotFound(props)
{
    return (
        <>
            <Canvas eventSource={document.getElementById("root")} shadows camera={{ position: [0, 0, 20], fov: 50 }}>
                <color attach="background" args={["#e0e0e0"]} />
                <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />
                <Text fontSize={14} letterSpacing={-0.025} color="black" {...props}>{uiJson.notFoundDescription.notFoundText}</Text>
            </Canvas>
            <div class="nav">
                <Link to="/">{uiJson.notFoundDescription.linkTo}</Link>
            </div>
            <div class="description_404">
                {uiJson.notFoundDescription.flavorText}
            </div>
        </>
    )
}