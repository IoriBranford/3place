import { useRouter } from "next/router";
import React, { useRef, useContext, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { FirstPersonControls, Line } from '@react-three/drei'
import Head from 'next/head';
import { EditorContext } from '../../contexts/Editor';
import { FirstPersonControls as FirstPersonControlImpl, LineSegments2 } from 'three-stdlib';
import { Gui } from '../../components/Gui';
import SquareRoom, { SquareRoomProps } from "../../components3D/SquareRoom";
import RoomObject, { RoomObjectProps } from "../../components3D/RoomObject";

function horizontalGridPoints(width: number, y: number) {
    const halfWidth = width / 2
    const points: [number, number, number][] = []
    for (let z = -halfWidth; z <= halfWidth; ++z) {
        points.push([halfWidth, y, z], [-halfWidth, y, z])
    }
    for (let x = -halfWidth; x <= halfWidth; ++x) {
        points.push([x, y, -halfWidth], [x, y, halfWidth])
    }
    return points
}

function wallGridPoints(width: number, height: number) {
    const halfWidth = width / 2 - 1 / 256
    const points: [number, number, number][] = []
    for (let y = 0; y <= height; ++y) {
        points.push([halfWidth, y, halfWidth], [-halfWidth, y, halfWidth],
            [halfWidth, y, halfWidth], [halfWidth, y, -halfWidth],
            [-halfWidth, y, -halfWidth], [-halfWidth, y, halfWidth],
            [-halfWidth, y, -halfWidth], [halfWidth, y, -halfWidth])
    }
    for (let z = -halfWidth; z <= halfWidth; ++z) {
        points.push([halfWidth, 0, z], [halfWidth, height, z],
            [-halfWidth, 0, z], [-halfWidth, height, z])
    }
    for (let x = -halfWidth; x <= halfWidth; ++x) {
        points.push([x, 0, halfWidth], [x, height, halfWidth],
            [x, 0, -halfWidth], [x, height, -halfWidth])
    }
    return points
}

function Scene({ roomProps, objects }: {
    roomProps: SquareRoomProps,
    objects?: RoomObjectProps[]
}) {
    const floorGrid = useRef<LineSegments2>(null!)
    const ceilingGrid = useRef<LineSegments2>(null!)
    const wallsGrid = useRef<LineSegments2>(null!)
    const editor = useContext(EditorContext)

    useFrame((state, delta) => {
        editor.flashSelectedObject(state.clock.elapsedTime)
        floorGrid.current.visible = editor.isSelectedObjectForSurface('floor')
        wallsGrid.current.visible = editor.isSelectedObjectForSurface('wall')
        ceilingGrid.current.visible = editor.isSelectedObjectForSurface('ceiling')
    })

    return <>
        <SquareRoom {...roomProps} />
        {objects?.map(object => <RoomObject {...object} />)}
        <Line ref={floorGrid} color={'white'} segments={true}
            points={horizontalGridPoints(roomProps.width, 1 / 256)} />
        <Line ref={ceilingGrid} color={'white'} segments={true}
            points={horizontalGridPoints(roomProps.width, roomProps.height - 1/256)}/>
        <Line ref={wallsGrid} color={'white'} segments={true}
            points={wallGridPoints(roomProps.width, roomProps.height)}/>
    </>
}

export default function RoomPage() {
    const firstPersonControls = useRef<FirstPersonControlImpl>(null!)
    const canvasRef = useRef<HTMLCanvasElement>(null!)

    useEffect(() => {
        window.addEventListener('resize', (e) => {
            firstPersonControls.current.handleResize()
        })

        const canvas = canvasRef.current

        canvas.addEventListener("touchstart", (event) => {
            event.preventDefault()
            if (event.touches.length > 0)
                firstPersonControls.current.enabled = true
        }, { passive: false })

        canvas.addEventListener("touchmove", (event) => {
            event.preventDefault()
            let touch = event.changedTouches[0]
            let mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY,
                screenX: touch.screenX,
                screenY: touch.screenY,
            })
            firstPersonControls.current.dispatchEvent(mouseEvent)
        }, { passive: false })

        canvas.addEventListener("touchend", (event) => {
            event.preventDefault()
            if (event.touches.length < 1)
                firstPersonControls.current.enabled = false
        }, { passive: false })
    })

    const router = useRouter();
    const roomId = router.query.roomId;

    let roomProps = {
        name: 'New room',
        height: 2,
        width: 4,
        wallImage: '/bricks.png',
        floorImage: '/wood.png',
        ceilingImage: '/wood.png',
    }
    let objects = [
        {
            type: 'PottedPlant',
            position: [1.5, 0, 1.5]
        },
        {
            type: 'FloorLamp',
            position: [-1.5, 0, 1.5]
        },
        {
            type: 'LoungeChair',
            position: [1.5, 0, -1.5]
        },
        {
            type: 'LCDTelevision',
            position: [-1.5, 0, -1.5]
        },
    ]

    // query db for room info by roomId
    // if found replace props values

    return (
        <>
            <Head>
                <title>{roomProps.name}</title>
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
            <Canvas ref={canvasRef}
                style={{ display: 'block', width: '100%', height: '100%' }}
                camera={{ position: [0, .5, 0], rotation: [0, -Math.PI / 2, 0] }}
                onMouseDown={(event) => {
                    if (event.button == 2)
                        firstPersonControls.current.enabled = true
                }}
                onMouseUp={(event) => {
                    if (event.button == 2)
                        firstPersonControls.current.enabled = false
                }}
                onMouseEnter={(event) => {
                    if (event.buttons & 2)
                        firstPersonControls.current.enabled = true
                }}
                onMouseLeave={() => {
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
                <Scene roomProps={roomProps} objects={objects} />
            </Canvas>
            <Gui firstMenu="" />
        </>
    )
}