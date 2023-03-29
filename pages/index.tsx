import React, { MutableRefObject, useRef, useLayoutEffect, createContext, useContext } from 'react'
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber'
import { FirstPersonControls, Plane, useTexture } from '@react-three/drei'
import Head from 'next/head';
import { BufferAttribute, Mesh, MeshStandardMaterial, RepeatWrapping, Texture } from 'three';
import { SplashScreen } from '../components/SplashScreen';

const SceneContext = createContext(null)

function Surface({
  name = '',
  position,
  rotation,
  width = 1,
  height = 1,
  image = '',
}) {
  const mesh = useRef<Mesh>(null!)
  const context = useContext(SceneContext)
  useLayoutEffect(()=> {
    const uv = mesh.current.geometry.getAttribute('uv') as BufferAttribute
    uv.setXY(0, 0, height)
    uv.setXY(1, width, height)
    uv.setXY(2, 0, 0)
    uv.setXY(3, width, 0)
  })
  const texture = image == '' ? null : useTexture(image, (texture:Texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping
  })
  return (
    <Plane name={name} ref={mesh} position={position} rotation={rotation}
      onClick={()=>{context.onClickSurface(mesh)}} args={[width, height]}>
      <meshStandardMaterial map={texture} />
    </Plane>
  )
}

function Room() {
  let images = {
    floor: 'Bricks_17-512x512.png',
    ceiling: 'Bricks_17-512x512.png',
    wallX0: 'Wood_02-512x512.png',
    wallX1: 'Wood_02-512x512.png',
    wallZ0: 'Wood_02-512x512.png',
    wallZ1: 'Wood_02-512x512.png',
  }
  return <>
    <Surface name='floor' position={[0, -.5, 0]} rotation={[-Math.PI / 2, 0, 0]}
      width={4} height={4} image={images.floor}/>
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

export function Scene({controlsRef}) {
  let pointedObject:MutableRefObject<Mesh> = null!
  let clickedObject:MutableRefObject<Mesh> = null!
  // const textureSelector = useRef<Group>(null!)

  function onClickTexture(event:ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    clickedObject = null
    // textureSelector.current.visible = false
    controlsRef.current.enabled = true
  }

  const onClickSurface = (mesh: MutableRefObject<Mesh>) => {
    if (clickedObject) {
      const standardMaterial = clickedObject.current.material as MeshStandardMaterial
      standardMaterial.color.set('white')
    }
    clickedObject = (clickedObject == mesh ? null : mesh)
    // textureSelector.current.visible = (clickedObject != null)
    controlsRef.current.enabled = (clickedObject == null)
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
    if (clickedObject) {
      const standardMaterial = clickedObject.current.material as MeshStandardMaterial
      const pulse = (3 + Math.cos(state.clock.elapsedTime * 8*Math.PI)) / 4
      standardMaterial.color.setScalar(pulse)
    }
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
    <SceneContext.Provider value={{
      onClickSurface:onClickSurface
    }}>
      <Room />
      {/* <TextureSelector/> */}
    </SceneContext.Provider>
  )
}

export default function ThreePlace() {
  const splashScreen = useRef<HTMLDivElement>(null!)
  const controls = useRef(null!)
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
      <Canvas style={{ display: 'block', width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 0], up: [0, 1, 0] }}>
        <FirstPersonControls ref={controls}
          enabled={false}
          movementSpeed={0} lookSpeed={.25}
          constrainVertical={true}
          verticalMin={Math.PI / 4}
          verticalMax={Math.PI * 3 / 4}
        />
        <Scene controlsRef={controls}/>
      </Canvas>
      <SplashScreen ref={splashScreen} onStartClick={() => {
        controls.current.enabled = true
        splashScreen.current.remove()
      }} />
    </>
  )
}