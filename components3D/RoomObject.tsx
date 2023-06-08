import { useGLTF } from "@react-three/drei";
import { useContext, useRef } from "react";
import { Euler, Object3D, Vector3 } from "three"
import { EditorContext } from "../contexts/Editor";
import { ThreeEvent } from "@react-three/fiber";
import { RoomObjectTypes } from "../data/RoomObjectTypes";

export interface RoomObjectProps {
    type: string
    position: Vector3 | number[];
    rotation?: Euler | number[];
}

export default function RoomObject({ type, position, rotation }: RoomObjectProps) {
    const typeData = RoomObjectTypes[type]
    const editor = useContext(EditorContext)
    const { scene } = useGLTF(typeData.modelUrl)
    const ref = useRef<Object3D>(null!)

    return <primitive object={scene} ref={ref}
        position={position} rotation={rotation}
        userData={{...typeData}}
        onClick={(e:ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            editor.onClickObject(ref.current)
        }}>
    </primitive>
}