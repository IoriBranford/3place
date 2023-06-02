import { useRouter } from "next/router";
import React, { useRef, useLayoutEffect, useContext } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { FirstPersonControls, Plane } from '@react-three/drei'
import Head from 'next/head';
import { EditorContext } from '../../contexts/Editor';
import { FirstPersonControls as FirstPersonControlImpl } from 'three-stdlib';
import { Gui } from '../../components/Gui';
import RectangleRoom from "../../components3D/RectangleRoom";

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
            ceilingImage={'/wood.png'} />
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
                camera={{ position: [0, .5, 0], rotation: [0, -Math.PI / 2, 0] }}
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
                <Scene roomData={roomData} />
            </Canvas>
            <Gui firstMenu="" />
        </>
    )
}