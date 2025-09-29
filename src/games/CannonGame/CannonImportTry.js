import { useGLTF } from "@react-three/drei";

export default function CannonImportTry()
{
    const { nodes, materials, scene } = useGLTF('/cannon.glb');

    return <primitive object={scene} />
}