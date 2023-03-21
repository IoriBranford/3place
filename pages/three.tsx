import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { FirstPersonControls } from '@react-three/drei'

function Box(props: ThreeElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => (mesh.current.rotation.x += delta))
    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

function Room() {
    return <object3D>
        <mesh name='floor' position={[0, -.25, 0]} rotation={[-Math.PI/2,0,0]}>
            <planeGeometry args={[2, 2]} />
            <meshStandardMaterial/>
        </mesh>
        <mesh name='ceiling' position={[0, .25, 0]} rotation={[Math.PI/2,0,0]}>
            <planeGeometry args={[2, 2]} />
            <meshStandardMaterial/>
        </mesh>
        <mesh name='wallZ0' position={[0, 0, -1]} rotation={[0,0,0]}>
            <planeGeometry args={[2, .5]} />
            <meshStandardMaterial/>
        </mesh>
        <mesh name='wallZ1' position={[0, 0, 1]} rotation={[0,Math.PI,0]}>
            <planeGeometry args={[2, .5]} />
            <meshStandardMaterial/>
        </mesh>
        <mesh name='wallX0' position={[-1, 0, 0]} rotation={[0,Math.PI/2,0]}>
            <planeGeometry args={[2, .5]} />
            <meshStandardMaterial/>
        </mesh>
        <mesh name='wallX1' position={[1, 0, 0]} rotation={[0,-Math.PI/2,0]}>
            <planeGeometry args={[2, .5]} />
            <meshStandardMaterial/>
        </mesh>
    </object3D>
}

export default function Three() {
    return (
        <div>
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
            <Canvas style={{display: 'block', width: '100%', height: '100%'}}
            camera={{ position: [0,0,0], up: [0,1,0] }}>
                <pointLight position={[0, .125, 0]}/>
                <Room/>
                <FirstPersonControls
                    movementSpeed={0} lookSpeed={.25}
                    constrainVertical={true}
                    verticalMin={Math.PI/6}
                    verticalMax={Math.PI*5/6}
                    />
            </Canvas>
        </div>
    )
}