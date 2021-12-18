import type { NextPage } from 'next'
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Loader,
  useGLTF,
  OrbitControls,
  PerspectiveCamera,
  Stars,
} from '@react-three/drei'
import { signIn } from 'next-auth/react'
import { Button } from 'antd'
import { RocketOutlined } from '@ant-design/icons'

import styles from '../styles/login.module.less'

type ModelUrl = {
  url: string
}

function Model({ url }: ModelUrl) {
  const { nodes } = useGLTF(url)
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={7}>
      <group rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}>
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.planet002.geometry}
          material={nodes.planet002.material}
        />
        <mesh
          geometry={nodes.planet003.geometry}
          material={nodes.planet003.material}
        />
      </group>
    </group>
  )
}

const Login: NextPage = () => {
  const onFinish = async () => {
    await signIn('google', {
      callbackUrl: window.location.origin,
    })
  }

  return (
    <>
      <div className={styles.bg} />
      <h1>TiSpace</h1>
      <Button
        type="dashed"
        ghost
        size={'large'}
        icon={<RocketOutlined />}
        className={styles.submit}
        onClick={onFinish}
      >
        Log in with Google
      </Button>
      <Canvas dpr={[1.5, 2]} linear shadows>
        <fog attach="fog" args={['#272730', 16, 30]} />
        <ambientLight intensity={0.75} />
        <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={75}>
          <pointLight intensity={1} position={[-10, -25, -10]} />
          <spotLight
            castShadow
            intensity={2.25}
            angle={0.2}
            penumbra={1}
            position={[-25, 20, -15]}
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />
        </PerspectiveCamera>
        <Suspense fallback={null}>
          <Model url="/scene.glb" />
        </Suspense>
        <OrbitControls
          autoRotate
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Stars radius={500} depth={50} count={1000} factor={10} />
      </Canvas>
      <div className={styles.layer} />
      <Loader />
    </>
  )
}

export default Login
