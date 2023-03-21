import React, { MutableRefObject, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { FirstPersonControls } from '@react-three/drei'
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { Mesh } from 'three';

function RoomPlane(props) {
  const ref = useRef<Mesh>(null!)
  return (
    <mesh ref={ref} position={props.position} rotation={props.rotation}
      onPointerOver={() => props.onPointerOver(ref)}
      onPointerOut={() => props.onPointerOut(ref)}>
      <planeGeometry args={props.planeGeometry} />
      <meshStandardMaterial color={props.pointedObject === ref ? 'red' : 'white'} />
    </mesh>
  )
}

function Room(props) {
  const [pointedObject, setPointedObject] = useState(null as MutableRefObject<Mesh>)

  const onPointerOver = (objectRef: MutableRefObject<Mesh>) => {
    if (!props.started)
      return
    if (pointedObject !== objectRef) {
      setPointedObject(objectRef)
    }
  }

  const onPointerOut = (objectRef: MutableRefObject<Mesh>) => {
    if (pointedObject === objectRef) {
      setPointedObject(null)
    }
  }

  return <object3D>
    <RoomPlane name='floor' position={[0, -.5, 0]} rotation={[-Math.PI / 2, 0, 0]}
      planeGeometry={[4, 4]}
      pointedObject={pointedObject}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut} />
    <RoomPlane name='ceiling' position={[0, .5, 0]} rotation={[Math.PI / 2, 0, 0]}
      planeGeometry={[4, 4]}
      pointedObject={pointedObject}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut} />
    <RoomPlane name='wallZ0' position={[0, 0, -2]} rotation={[0, 0, 0]}
      planeGeometry={[4, 1]}
      pointedObject={pointedObject}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut} />
    <RoomPlane name='wallZ1' position={[0, 0, 2]} rotation={[0, Math.PI, 0]}
      planeGeometry={[4, 1]}
      pointedObject={pointedObject}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut} />
    <RoomPlane name='wallX0' position={[-2, 0, 0]} rotation={[0, Math.PI / 2, 0]}
      planeGeometry={[4, 1]}
      pointedObject={pointedObject}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut} />
    <RoomPlane name='wallX1' position={[2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}
      planeGeometry={[4, 1]}
      pointedObject={pointedObject}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut} />
    <pointLight position={[0, .25, 0]} />
    <FirstPersonControls
      enabled={props.started}
      movementSpeed={0} lookSpeed={.25}
      constrainVertical={true}
      verticalMin={Math.PI / 4}
      verticalMax={Math.PI * 3 / 4}
    />
  </object3D>
}

function SplashScreen(props: { onClick: React.MouseEventHandler<HTMLDivElement>; }) {
  return (
    <div className={styles.container} style={{ position: 'absolute', left: 0, top: 0, width: '100%' }}>

      <main>
        <h1 className={styles.title}>
          Welcome to 3place!
        </h1>

        <p className={styles.description}>
          Your virtual rooms on the Web
        </p>

        <div className={styles.grid}>
          <div className={styles.card} onClick={props.onClick}>
            <p>ENTER</p>
          </div>
        </div>
      </main>

      <footer>
        <a
          href="https://threejs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by three.js
        </a>
      </footer>

      <style jsx>{`
            main {
              padding: 5rem 0;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            footer {
              width: 100%;
              height: 100px;
              border-top: 1px solid #eaeaea;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            footer img {
              margin-left: 0.5rem;
            }
            footer a {
              display: flex;
              justify-content: center;
              align-items: center;
              text-decoration: none;
              color: inherit;
            }
            code {
              background: #fafafa;
              border-radius: 5px;
              padding: 0.75rem;
              font-size: 1.1rem;
              font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
            }
          `}</style>

      <style jsx global>{`
            html,
            body {
              padding: 0;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
            }
            * {
              box-sizing: border-box;
            }
          `}</style>
    </div>
  )
}

export default function ThreePlace() {
  const [started, setStarted] = useState(false)
  return (
    <div>
      <Head>
        <title>3place</title>
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
        camera={{ position: [0, 0, 0], up: [0, 1, 0] }}>
        <Room started={started} />
      </Canvas>
      {started ? null : (<SplashScreen onClick={() => setStarted(true)} />)}
    </div>
  )
}