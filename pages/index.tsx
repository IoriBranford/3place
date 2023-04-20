import React, { useRef, useLayoutEffect, useContext } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { FirstPersonControls, Plane } from '@react-three/drei'
import Head from 'next/head';
import { BufferAttribute, Mesh } from 'three';
import { Assets, AssetsContext } from '../contexts/Assets';
import { Editor, EditorContext } from '../contexts/Editor';
import { FirstPersonControls as FirstPersonControlImpl } from 'three-stdlib';
import { Controls, ControlsContext } from '../contexts/Controls';
import { Gui } from '../components/Gui';

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
  const controls = useContext(ControlsContext)
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
    controls.setEnabled(false)
  }
  return (
    <Plane name={name} ref={mesh} position={position} rotation={rotation}
      onClick={onClick} args={[width, height]}>
      <meshStandardMaterial map={texture} />
    </Plane>
  )
}

function Room() {
  let images = {
    floor: '/bricks.png',
    ceiling: '/bricks.png',
    wallX0: '/wood.png',
    wallX1: '/wood.png',
    wallZ0: '/wood.png',
    wallZ1: '/wood.png',
  }
  return <>
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
  </>
}

export function Scene() {
  const editor = useContext(EditorContext)

  useFrame((state, delta) => {
    editor.flashSelectedMesh(state.clock.elapsedTime)
  })

  return (
    <Room />
  )
}

export default function ThreePlace() {
  const firstPersonControls = useRef<FirstPersonControlImpl>(null!)
  const assets = new Assets()
  const editor = new Editor()
  const controls = new Controls(firstPersonControls)
  return (
    <>
      <Head>
        <title>3place</title>
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
      <AssetsContext.Provider value={assets}>
        <ControlsContext.Provider value={controls}>
          <EditorContext.Provider value={editor}>
            <Canvas style={{ display: 'block', width: '100%', height: '100%' }}
              camera={{ position: [0, 0, 0], up: [0, 1, 0] }}>
              <FirstPersonControls ref={firstPersonControls}
                enabled={false}
                movementSpeed={0} lookSpeed={.25}
                constrainVertical={true}
                verticalMin={Math.PI / 4}
                verticalMax={Math.PI * 3 / 4}
              />
              <Scene />
            </Canvas>
            <Gui firstMenu="SplashScreen" />
          </EditorContext.Provider>
        </ControlsContext.Provider>
      </AssetsContext.Provider >
    </>
  )
}