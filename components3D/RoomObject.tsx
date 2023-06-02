import { useGLTF } from "@react-three/drei";
import { Euler, Vector3 } from "three"

interface RoomObjectProps {
    model: string
    position?: Vector3 | number[];
    rotation?: Euler | number[];
}

export default function RoomObject({ model, position, rotation }: RoomObjectProps) {
    const gltf = useGLTF(model)
    return <primitive object={gltf.scene} position={position} rotation={rotation} />
}