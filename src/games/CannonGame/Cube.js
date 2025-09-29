import { useEffect } from "react";
import { useBox } from "@react-three/cannon";

export default function Cube({ position, cubePositionsRef, index, cubePhysicalApi })
{

    const [cubeRef, api] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 1, 1],
    userData: { type: 'cube', index }
    }))
    
    // Subscribe to position changes
    useEffect(() => {
        cubePhysicalApi?.(api)
    }, [])

    return (
    <mesh ref={cubeRef}>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
    </mesh>
    )
}