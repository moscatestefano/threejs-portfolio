import { usePlane } from '@react-three/cannon';

export default function Platform({ position })
{
    const [planeRef] = usePlane(position => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
    type: 'Static'
    }));

    return (
    <mesh ref={planeRef}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#666666" />
    </mesh>
    );
}