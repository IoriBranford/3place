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

    function onClick(event: ThreeEvent<MouseEvent>) {
        const object = event.eventObject
        event.stopPropagation()
        if (editor.isMovingRoomObject(object)) {
            editor.setSelectedObject(null!)
        } else {
            editor.onClickObject(object)
        }
    }

    return <primitive object={scene}
        position={position} rotation={rotation}
        userData={{ ...typeData }}
        onClick={onClick}>
    </primitive>
}