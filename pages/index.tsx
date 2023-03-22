import React, { MutableRefObject, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { FirstPersonControls, useTexture } from '@react-three/drei'
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { Mesh, MeshStandardMaterial, RepeatWrapping } from 'three';

function Room(props) {
  let pointedObject:MutableRefObject<Mesh> = null!
  const onPointerOver = (mesh: MutableRefObject<Mesh>) => {
    if (pointedObject !== mesh) {
      pointedObject = mesh
      const standardMaterial = mesh.current.material as MeshStandardMaterial
      standardMaterial.color.set(0xFF0000)
    }
  }

  const onPointerOut = (mesh: MutableRefObject<Mesh>) => {
    if (pointedObject === mesh) {
      const standardMaterial = mesh.current.material as MeshStandardMaterial
      standardMaterial.color.set(0xFFFFFF)
      pointedObject = null
    }
  }
  
  function Surface(props) {
    const mesh = useRef<Mesh>(null!)
    const textures = useTexture({
      map: 'Wood_02-512x512.png'
    })
    if (props.planeGeometry && props.planeGeometry.length >= 2)
      textures.map.repeat.set(props.planeGeometry[0], props.planeGeometry[1])
    textures.map.wrapS = RepeatWrapping
    textures.map.wrapT = RepeatWrapping
    return (
      <mesh ref={mesh} position={props.position} rotation={props.rotation}
        onPointerOver={() => onPointerOver(mesh)}
        onPointerOut={() => onPointerOut(mesh)}>
        <planeGeometry args={props.planeGeometry} />
        <meshStandardMaterial {...textures} />
      </mesh>
    )
  }

  return <object3D>
    <Surface name='floor' position={[0, -.5, 0]} rotation={[-Math.PI / 2, 0, 0]}
      planeGeometry={[4, 4]} />
    <Surface name='ceiling' position={[0, .5, 0]} rotation={[Math.PI / 2, 0, 0]}
      planeGeometry={[4, 4]} />
    <Surface name='wallZ0' position={[0, 0, -2]} rotation={[0, 0, 0]}
      planeGeometry={[4, 1]} />
    <Surface name='wallZ1' position={[0, 0, 2]} rotation={[0, Math.PI, 0]}
      planeGeometry={[4, 1]} />
    <Surface name='wallX0' position={[-2, 0, 0]} rotation={[0, Math.PI / 2, 0]}
      planeGeometry={[4, 1]} />
    <Surface name='wallX1' position={[2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}
      planeGeometry={[4, 1]} />
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