import { useGLTF } from "@react-three/drei";
import { useContext, useRef } from "react";
import { Euler, Object3D, Vector3 } from "three"
import { EditorContext } from "../contexts/Editor";
import { ThreeEvent } from "@react-three/fiber";

export interface RoomObjectProps {
    model: string
    position?: Vector3 | number[];
    rotation?: Euler | number[];
}

export default function RoomObject({ model, position, rotation }: RoomObjectProps) {
    const editor = useContext(EditorContext)
    const { scene } = useGLTF(model)
    const ref = useRef<Object3D>(null!)

    return <primitive object={scene} ref={ref}
        position={position} rotation={rotation}
        userData={{
            forSurface: 'floor',
            contextMenu: 'RoomObjectMenu'
        }}
        onClick={(e:ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            editor.onClickObject(ref.current)
        }}>
    </primitive>
}