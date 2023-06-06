import { Canvas, useFrame } from '@react-three/fiber'
import Head from 'next/head';
import { SplashScreen } from '../components/SplashScreen';
import SquareRoom from '../components3D/SquareRoom';
import RoomObject from '../components3D/RoomObject';

function Scene() {
  useFrame((state, delta) => {
    state.camera.rotateY(delta * Math.PI / 30)
  })

  let objects = [
    {
      model: '/pottedPlant.glb',
      position: [1.5, 0, 1.5]
    },
    {
      model: '/lampRoundFloor.glb',
      position: [-1.5, 0, 1.5]
    },
    {
      model: '/loungeChair.glb',
      position: [1.5, 0, -1.5]
    },
    {
      model: '/televisionOnCabinet.glb',
      position: [-1.5, 0, -1.5]
    },
  ]

  return <>
    <SquareRoom
      name={''}
      height={2}
      width={4}
      wallImage={'/bricks.png'}
      floorImage={'/wood.png'}
      ceilingImage={'/wood.png'} />
    {objects?.map(object => <RoomObject {...object} />)}
  </>
}

export default function ThreePlace() {
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
        camera={{ position: [0, 0.5, 0], rotation: [0, -Math.PI / 2, 0] }}>
        <Scene />
      </Canvas>
      <SplashScreen />
    </>
  )
}