import { useRef, useContext, useLayoutEffect } from "react"
import { BufferAttribute, Mesh, Object3D } from "three"
import { AssetsContext } from "../contexts/Assets"
import { EditorContext } from "../contexts/Editor"
import { Plane } from "@react-three/drei"
import { ThreeEvent } from "@react-three/fiber"

export interface SquareRoomProps {
    name: string
    width: number
    height: number
    wallImage: string
    floorImage: string
    ceilingImage: string
}

function setUVs(plane: Mesh, width: number, height: number) {
    const uv = plane.geometry.getAttribute('uv') as BufferAttribute
    uv.setXY(0, 0, height)
    uv.setXY(1, width, height)
    uv.setXY(2, 0, 0)
    uv.setXY(3, width, 0)
}

function SurfaceMaterial({ image = '' }) {
    const assets = useContext(AssetsContext)
    const texture = image == '' ? null : assets.getTexture(image)
    return <meshStandardMaterial map={texture} />
}

export default function SquareRoom({ width = 4, height = 1, wallImage = '', floorImage = '', ceilingImage = '' }: SquareRoomProps) {
    const wallsRef = useRef<Object3D>(null!)
    const floorRef = useRef<Mesh>(null!)
    const ceilingRef = useRef<Mesh>(null!)
    const editor = useContext(EditorContext)

    useLayoutEffect(() => {
        wallsRef.current.children.map((wall: Mesh) => {
            if (wall.isMesh)
                setUVs(wall, width, height)
        })
        setUVs(floorRef.current, width, width)
        setUVs(ceilingRef.current, width, width)
    })

    const wallMaterial = <SurfaceMaterial image={wallImage} />
    const floorMaterial = <SurfaceMaterial image={floorImage} />
    const ceilingMaterial = <SurfaceMaterial image={ceilingImage} />

    const r = width / 2
    const PI = Math.PI

    function onPointerMove(event: ThreeEvent<MouseEvent>) {
        if (editor.isMovingRoomObject(editor.selectedObject, event.eventObject.userData.surfaceType)) {
            editor.setSelectedObjectPosition(event.intersections[0].point)
        }
    }

    function onClick(event: ThreeEvent<MouseEvent>) {
        if (editor.isMovingRoomObject(editor.selectedObject)) {
            editor.setSelectedObject(null!)
        } else {
            editor.onClickObject(event.eventObject)
        }
    }

    return <>
        <pointLight
            position={[0, height - .5, 0]} />

        <Plane ref={floorRef}
            onClick={onClick}
            onPointerMove={onPointerMove}
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            args={[width, width]}
            userData={{
                surfaceType: 'floor',
                contextMenu: 'TextureMenu',
                textureUrl: floorImage,
            }}
        >
            {floorMaterial}
        </Plane>

        <Plane ref={ceilingRef}
            onClick={onClick}
            position={[0, height, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            args={[width, width]}
            userData={{
                surfaceType: 'ceiling',
                contextMenu: 'TextureMenu',
                textureUrl: ceilingImage,
            }}>
            {ceilingMaterial}
        </Plane>

        <object3D ref={wallsRef}
            position={[0, height / 2, 0]}
            onClick={onClick}
            userData={{
                surfaceType: 'wall',
                contextMenu: 'TextureMenu',
                textureUrl: wallImage,
            }}>

            <Plane
                position={[0, 0, -r]}
                rotation={[0, 0, 0]}
                args={[width, height]}>
                {wallMaterial}
            </Plane>

            <Plane
                position={[0, 0, r]}
                rotation={[0, PI, 0]}
                args={[width, height]}>
                {wallMaterial}
            </Plane>

            <Plane
                position={[-r, 0, 0]}
                rotation={[0, PI / 2, 0]}
                args={[width, height]}>
                {wallMaterial}
            </Plane>

            <Plane
                position={[r, 0, 0]}
                rotation={[0, -PI / 2, 0]}
                args={[width, height]}>
                {wallMaterial}
            </Plane>

        </object3D>
    </>
}