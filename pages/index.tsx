import React, { MutableRefObject, useRef, useLayoutEffect, useContext } from 'react'
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber'
import { FirstPersonControls, Plane } from '@react-three/drei'
import Head from 'next/head';
import { BufferAttribute, Mesh } from 'three';
import { SplashScreen } from '../components/SplashScreen';
import { App, AppContext } from '../contexts/App';
import { FirstPersonControls as FirstPersonControlImpl } from 'three-stdlib';
import { TextureMenu } from '../components/TextureMenu';

function Surface({
  name = '',
  position,
  rotation,
  width = 1,
  height = 1,
  image = '',
}) {
  const mesh = useRef<Mesh>(null!)
  const app = useContext(AppContext)
  useLayoutEffect(() => {
    const uv = mesh.current.geometry.getAttribute('uv') as BufferAttribute
    uv.setXY(0, 0, height)
    uv.setXY(1, width, height)
    uv.setXY(2, 0, 0)
    uv.setXY(3, width, 0)
  })
  const texture = image == '' ? null : app.getTexture(image)
  return (
    <Plane name={name} ref={mesh} position={position} rotation={rotation}
      onClick={() => { app.onClickMesh(mesh.current) }} args={[width, height]}>
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
  let context = useContext(AppContext)
  let pointedObject: MutableRefObject<Mesh> = null!
  // const textureSelector = useRef<Group>(null!)

  function onClickTexture(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    // clickedObject = null
    // textureSelector.current.visible = false
    // controlsRef.current.enabled = true
  }

  const onPointerOverSurface = (mesh: MutableRefObject<Mesh>) => {
    if (pointedObject !== mesh) {
      pointedObject = mesh
    }
  }

  const onPointerOutSurface = (mesh: MutableRefObject<Mesh>) => {
    if (pointedObject === mesh) {
      pointedObject = null
    }
  }

  useFrame((state, delta) => {
    context.flashSelectedMesh(state.clock.elapsedTime)
  })

  // const depth = 1/8
  // const scale = new Vector3(1/32, 1/32, 1)
  // function TextureSelector() {
  //   return (
  //     <ScreenSpace ref={textureSelector} depth={depth} scale={scale} visible={false}>
  //       <sprite position={[6, 0, 0]} onClick={onClickTexture}>
  //         <spriteMaterial map={surfaceTextures['floor']}/>
  //       </sprite>
  //       <sprite position={[6, 1, 0]} onClick={onClickTexture}>
  //         <spriteMaterial map={surfaceTextures['wallX0']}/>
  //       </sprite>
  //     </ScreenSpace>
  //   )
  // }

  return (
    <Room />
  )
}

export default function ThreePlace() {
  const firstPersonControls = useRef<FirstPersonControlImpl>(null!)
  const app = new App(firstPersonControls)
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
      <AppContext.Provider value={app}>
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
        <SplashScreen />
        <TextureMenu />
      </AppContext.Provider>
    </>
  )
}