import { useRouter } from "next/router";
import React, { useRef, useLayoutEffect, useContext } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { FirstPersonControls, Plane } from '@react-three/drei'
import Head from 'next/head';
import { BufferAttribute, Mesh } from 'three';
import { AssetsContext } from '../../contexts/Assets';
import { EditorContext } from '../../contexts/Editor';
import { FirstPersonControls as FirstPersonControlImpl } from 'three-stdlib';
import { Gui } from '../../components/Gui';
import RectangleRoom from "../../components3D/RectangleRoom";

function Surface({
    name = '',
    position,
    rotation,
    width = 1,
    height = 1,
    image = '',
}) {
    const mesh = useRef<Mesh>(null!)
    const editor = useContext(EditorContext)
    const assets = useContext(AssetsContext)
    useLayoutEffect(() => {
        const uv = mesh.current.geometry.getAttribute('uv') as BufferAttribute
        uv.setXY(0, 0, height)
        uv.setXY(1, width, height)
        uv.setXY(2, 0, 0)
        uv.setXY(3, width, 0)
    })
    const texture = image == '' ? null : assets.getTexture(image)
    function onClick() {
        editor.onClickMesh(mesh.current)
    }
    return (
        <Plane name={name} ref={mesh} position={position} rotation={rotation}
            onClick={onClick} args={[width, height]}>
            <meshStandardMaterial map={texture} />
        </Plane>
    )
}

function DefaultRoom() {
    let images = {
        floor: '/bricks.png',
        ceiling: '/bricks.png',
        wallX0: '/wood.png',
        wallX1: '/wood.png',
        wallZ0: '/wood.png',
        wallZ1: '/wood.png',
    }
    return <object3D>
        <Surface name='floor' position={[0, -.5, 0]} rotation={[-Math.PI / 2, 0, 0]}
            width={4} height={4} image={images.floor} />
        <Surface name='ceiling' position={[0, .5, 0]} rotation={[Math.PI / 2, 0, 0]}
            width={4} height={4} image={images.ceiling} />
        <Surface name='wallZ0' position={[0, 0, -2]} rotation={[0, 0, 0]}
            width={4} height={1} image={images.wallZ0} />
        <Surface name='wallZ1' position={[0, 0, 2]} rotation={[0, Math.PI, 0]}
            width={4} height={1} image={images.wallZ1} />
        <Surface name='wallX0' position={[-2, 0, 0]} rotation={[0, Math.PI / 2, 0]}
            width={4} height={1} image={images.wallX0} />
        <Surface name='wallX1' position={[2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}
            width={4} height={1} image={images.wallX1} />
        <pointLight position={[0, .25, 0]} />
    </object3D>
}

export function Scene({ roomData = null }) {
    const editor = useContext(EditorContext)

    useFrame((state, delta) => {
        editor.flashSelectedObject(state.clock.elapsedTime)
    })

    let room
    if (roomData) {
        // load it into object3d
    } else {
        room = <RectangleRoom
            height={2}
            width={5}
            wallImage={'/bricks.png'}
            floorImage={'/wood.png'}
            ceilingImage={'/wood.png'}/>
    }
    return room
}

export default function RoomPage() {
    const router = useRouter();
    const roomId = router.query.roomId;

    const roomData = null // query db with roomId for room data

    // if room found, load it as object3d
    // else, load default room

    const roomName = 'Start Room'

    const firstPersonControls = useRef<FirstPersonControlImpl>(null!)
    return (
        <>
            <Head>
                <title>{roomName}</title>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png"></link>
            </Head>
            <style jsx global>{`
                html,
                body,
                body > div:first-child,
                div#__next,
                div#__next > div {
                    padding: 0;
                    margin: 0;
                    height: 100%;
                }
            `}
            </style>
            <Canvas style={{ display: 'block', width: '100%', height: '100%' }}
                camera={{ position: [0, .5, 0], up: [0, 1, 0] }}
                onMouseDown={(event) => {
                    if (event.button == 2)
                        firstPersonControls.current.enabled = true
                }}
                onMouseUp={(event) => {
                    if (event.button == 2)
                        firstPersonControls.current.enabled = false
                }}
                onTouchStart={(event) => {
                    if (event.touches.length > 0)
                        firstPersonControls.current.enabled = true
                }}
                onTouchMove={(event) => {
                    let touch = event.changedTouches[0]
                    let mouseEvent = new MouseEvent("mousemove", {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        screenX: touch.screenX,
                        screenY: touch.screenY,
                    })
                    firstPersonControls.current.dispatchEvent(mouseEvent)
                }}
                onTouchEnd={(event) => {
                    if (event.touches.length < 1)
                        firstPersonControls.current.enabled = false
                }}
            >
                <FirstPersonControls ref={firstPersonControls}
                    enabled={false}
                    movementSpeed={0} lookSpeed={.25}
                    constrainVertical={true}
                    verticalMin={Math.PI / 4}
                    verticalMax={Math.PI * 3 / 4}
                />
                <Scene roomData={roomData}/>
            </Canvas>
            <Gui firstMenu="" />
        </>
    )
}