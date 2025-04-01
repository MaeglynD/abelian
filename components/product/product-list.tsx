'use client';

import {
  AccumulativeShadows,
  Center,
  MeshTransmissionMaterial,
  OrbitControls,
  RandomizedLight,
  RoundedBox,
  useTexture,
  Environment,
  Outlines,
  Float,
  useCursor,
  Image,
  Html,
  useDetectGPU,
  Stage,
  Text3D,
  Loader,
  Preload
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
// @ts-ignore
import { Product } from 'lib/types';
import { useCallback, useState, useMemo, useRef, useEffect, Suspense } from 'react';
import {
  DoubleSide,
  MeshPhongMaterial,
  // MeshPhysicalMaterial,
  Vector3,
  Vector4
} from 'three';
import CustomShaderMaterial from 'three-custom-shader-material';
import s from './product-list.module.css';
import { useSpring, animated } from '@react-spring/three';
import { useTransitionRouter } from 'next-view-transitions';

const AnimatedMeshTransmissionMaterial = animated(MeshTransmissionMaterial);

// function FollowCursor() {
//   const { camera, pointer } = useThree();
//   const vec = new Vector3();

//   let s = 30;
//   return useFrame(() => {
//     camera.position.lerp(vec.set(-s * pointer.x, s * pointer.y, camera.position.z), 0.05);
//     // camera.lookAt(s * pointer.x, s * pointer.y, 0);
//   });
// }

export function ProductList({ products }: { products: Product[] }) {
  return (
    <div className={s.container}>
      <div className={s.listContainer}>
        <Canvas camera={{ position: [0, 4, 33], fov: 25 }}>
          <Suspense fallback={null}>
            <ProductStage products={products} />
            {/* <Environment background backgroundBlurriness={1} preset="forest" /> */}
          </Suspense>
          <Preload all />
        </Canvas>
        <Loader />
      </div>
    </div>
  );
}

function ProductStage({ products }) {
  const GPUTier = useDetectGPU({ benchmarksURL: './benchmarks' });
  const goodGPU = GPUTier.tier >= 2;
  const [hovered, setHovered] = useState(false);
  const [text, setText] = useState('');
  const [textVisible, setTextVisible] = useState(false);

  // const materialProps = useControls({
  //   thickness: { value: 1.6, min: 0, max: 10, step: 0.05 },
  //   roughness: { value: 0.3, min: 0, max: 10, step: 0.1 },
  //   // transmission: { value: 1.4, min: 0, max: 10, step: 0.1 },
  //   ior: { value: 0.6, min: 0, max: 10, step: 0.1 },
  //   chromaticAberration: { value: 0.44, min: 0, max: 10 },
  //   backside: { value: true }
  // });

  // const textProps = useControls({
  //   height: { value: 0.2, min: 0, max: 1, step: 0.01 },
  //   curveSegments: { value: 16, min: 1, max: 32, step: 1 },
  //   bevelEnabled: true,
  //   bevelSize: { value: 0.009, min: 0, max: 0.1, step: 0.001 },
  //   bevelThickness: { value: 0.01, min: 0, max: 0.1, step: 0.001 },
  //   font: './seasons.json',
  //   left: true,
  //   position: {
  //     value: [0, 0, 0],
  //     step: 0.1
  //   },
  //   size: { value: 1, min: 0, max: 10, step: 0.1 }
  // });

  const springs = useSpring({
    opacity: textVisible ? 1 : 0,
    onRest: () => {
      if (!textVisible) setText('');
    },
    config: { duration: 200 }
  });

  // @ts-ignore
  const updateText = useCallback((newText: string) => {
    if (newText) {
      setText(newText);
      setTextVisible(true);
    } else {
      setTextVisible(false);
    }
  });

  return (
    <Stage adjustCamera={false} shadows="contact" environment="city">
      <group position={[0, -2.5, 0]}>
        <Center top>
          <group position={[-6, 0, 2.5]} rotation={[0, 0.7, 0]}>
            <Float>
              {/* @ts-ignore */}
              <Product
                product={products[0]}
                goodGPU={goodGPU}
                hovered={hovered}
                setHovered={setHovered}
                setText={updateText}
              />
            </Float>
          </group>
          <group position={[0, 0, 0]}>
            <Float>
              {/* @ts-ignore */}
              <Product
                product={products[1]}
                goodGPU={goodGPU}
                hovered={hovered}
                setHovered={setHovered}
                setText={updateText}
              />
            </Float>
          </group>
          <group position={[6, 0, 2.5]} rotation={[0, -0.7, 0]}>
            <Float>
              {/* @ts-ignore */}
              <Product
                product={products[2]}
                goodGPU={goodGPU}
                hovered={hovered}
                setHovered={setHovered}
                setText={updateText}
              />
            </Float>
          </group>
        </Center>

        {goodGPU && (
          <Text3D
            height={0.48}
            curveSegments={9}
            bevelEnabled
            bevelSize={0.04}
            bevelThickness={0.02}
            font="./seasons.json"
            size={1}
            position={[-8, 0, 5]}
            // {...textProps}
          >
            {text}
            <AnimatedMeshTransmissionMaterial
              thickness={0.65}
              roughness={0.1}
              ior={0.6}
              chromaticAberration={0.75}
              backside={true}
              transparent={true}
              opacity={springs.opacity}
              transmission={1.6}
              // {...materialProps}
            />
          </Text3D>
        )}

        {/* {goodGPU && (
              <AccumulativeShadows
                temporal
                frames={100}
                alphaTest={0.9}
                color="#3ead5d"
                colorBlend={1}
                opacity={0.8}
                scale={20}
              >
                <RandomizedLight
                  radius={10}
                  ambient={0.5}
                  intensity={Math.PI}
                  position={[2.5, 8, -2.5]}
                  bias={0.001}
                />
              </AccumulativeShadows>
            )} */}
      </group>
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        // autoRotate
        autoRotateSpeed={0.05}
        makeDefault
      />
    </Stage>
  );
}

function Product({ product: p, goodGPU, hovered, setHovered, setText, onClick }) {
  // @ts-ignore
  const matRef = useRef();
  // @ts-ignore
  const transmissionMatRef = useRef();

  const router = useTransitionRouter();
  const img = useTexture(p.featuredImage.url);
  const { pointer, viewport, camera } = useThree();
  const springs = useSpring({
    thickness: hovered ? 0.1 : 3,
    chromaticAberration: hovered ? 0.0 : 0.8
  });

  useCursor(hovered, 'pointer');

  useFrame((state, delta) => {
    // @ts-ignore
    matRef.current.uniforms.iTime.value += delta;
    // @ts-ignore
    matRef.current.uniforms.iMouse.value.setX(pointer.x);
    // @ts-ignore
    matRef.current.uniforms.iMouse.value.setY(pointer.y);
  });

  const uniforms = useMemo(
    () => ({
      img: { value: img },
      iMouse: { value: new Vector4(0, 0, 0, 1) },
      iTime: { value: 0.0 },
      iResolution: {
        value: new Vector3(viewport.width, viewport.height, 1)
      }
      // hover: { value: false }
    }),
    []
  );

  // const materialProps = useControls({
  //   thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
  //   roughness: { value: 0, min: 0, max: 1, step: 0.1 },
  //   transmission: { value: 1, min: 0, max: 1, step: 0.1 },
  //   ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
  //   chromaticAberration: { value: 0.08, min: 0, max: 1 },
  //   backside: { value: true }
  // });

  return (
    <>
      <RoundedBox
        args={[5, 5 + 1, 1]}
        radius={0.05}
        smoothness={4}
        bevelSegments={4}
        creaseAngle={0.4}
        onPointerOver={() => {
          setHovered(true);
          setText(p.title);
          // matRef.current.uniforms.hover.value = true;
        }}
        onPointerOut={() => {
          // matRef.current.uniforms.hover.value = false;
          setHovered(false);
          setText('');
        }}
        onClick={() => router.push(`/product/${p.handle}`)}
      >
        <AnimatedMeshTransmissionMaterial
          // {...materialProps}
          thickness={2.3}
          roughness={0}
          transmission={1}
          ior={1.2}
          chromaticAberration={springs.chromaticAberration}
          backside={true}
          samples={goodGPU ? 5 : 2}
          // resolution={goodGPU ? 512 : 1024}
        />
      </RoundedBox>

      <mesh castShadow>
        <planeGeometry args={[5, 5]} />
        <CustomShaderMaterial
          ref={matRef}
          baseMaterial={MeshPhongMaterial}
          vertexShader={`  
            // uniform bool hover;
            uniform float iTime;
          varying vec2 vUv;

          void main() {
            vUv = uv;
            // csm_Position = vec3(position.x, position.y, position.z)
          }`}
          fragmentShader={`    
          uniform sampler2D img; 
          uniform vec4 iMouse;
          uniform vec3 iResolution;
          uniform float iTime;
          varying vec2 vUv;


          void main() {
            // vec4 fragColor = mainImage(vUv * iResolution.xy);
            // vec3 fragColor = vec3(cos(2.*vUv.x), sin(0.4*vUv.x*vUv.y), 0.5);
            
            
            csm_FragColor = texture2D(img, vUv);
            // csm_FragColor.a = 0.1;
            // csm_FragColor = vec4(fragColor.x, fragColor.y, fragColor.z, 1);
          }`}
          uniforms={uniforms}
          side={DoubleSide}
          transparent={true}
        />
      </mesh>
    </>
  );
}
