import { useLoader } from "@react-three/fiber"
import { Euler, Vector3 } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

interface RoomObjectProps {
    model: string
    position?: Vector3 | number[];
    rotation?: Euler | number[];
}

export default function RoomObject({ model, position, rotation }: RoomObjectProps) {
    const gltf = useLoader(GLTFLoader, model)
    return <primitive object={gltf.scene} position={position} rotation={rotation} />
}