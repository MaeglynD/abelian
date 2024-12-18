'use client';

import { Center } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { ParametricGeometries } from 'three/addons/geometries/ParametricGeometries.js';
// @ts-ignore
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

export function Klein({ texture, roughness }: { texture: any; roughness: number }) {
  const geometry = useMemo(() => {
    return new ParametricGeometry(ParametricGeometries.klein, 100, 20);
  }, []);

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 13);
  texture.offset.set(0, 0);

  useEffect(() => {
    if (texture) {
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <Center top>
      <mesh
        scale={[0.1, 0.1, 0.1]}
        castShadow
        geometry={geometry}
        position={[0, 0, -0.01]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh
        scale={[0.1, 0.1, 0.1]}
        castShadow
        geometry={geometry}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={0.1}
          wireframe={true}
        />
      </mesh>
      <mesh
        scale={[0.1, 0.1, 0.1]}
        castShadow
        geometry={geometry}
        position={[0.0, 0.0, 0.01]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={1}
        />
      </mesh>
    </Center>
  );
}

export function Sphere({ texture, roughness }: { texture: any; roughness: number }) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  texture.offset.set(0, 0.1);

  useEffect(() => {
    if (texture) {
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <Center top>
      <mesh castShadow>
        <sphereGeometry args={[0.74, 34, 34]} />
        <meshStandardMaterial
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={0.4}
          wireframe={true}
        />
      </mesh>
      <mesh castShadow>
        <sphereGeometry args={[0.75, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Center>
  );
}

export function MobiusStrip({ texture, roughness }: { texture: any; roughness: number }) {
  const geometry = useMemo(() => {
    return new ParametricGeometry(ParametricGeometries.mobius, 100, 20);
  }, []);

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 14);
  texture.offset.set(0, 0);

  useEffect(() => {
    if (texture) {
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <Center top>
      <mesh
        scale={[0.56, 0.56, 0.56]}
        castShadow
        geometry={geometry}
        position={[0.0, 0.0, -0.01]}
        rotation={[-4, -2.6, 2]}
      >
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh
        scale={[0.56, 0.56, 0.56]}
        geometry={geometry}
        rotation={[-4, -2.6, 2]}
        position={[0.0, 0.0, 0.0]}
      >
        <meshStandardMaterial
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={0.1}
          wireframe={true}
        />
      </mesh>
      <mesh
        scale={[0.56, 0.56, 0.56]}
        castShadow
        geometry={geometry}
        position={[0.0, 0.0, 0.01]}
        rotation={[-4, -2.6, 2]}
      >
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={1}
        />
      </mesh>
    </Center>
  );
}

export function Torus({ texture, roughness }: { texture: any; roughness: number }) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(11, 3);
  texture.offset.set(1, 1.43);

  useEffect(() => {
    if (texture) {
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <Center top>
      <mesh castShadow rotation={[-(Math.PI / 2), 0.1, 1]}>
        <torusGeometry args={[0.79, 0.39, 50, 50]} />
        <meshStandardMaterial
          metalness={1}
          roughness={roughness}
          transparent={true}
          wireframe={true}
          opacity={0.4}
        />
      </mesh>
      <mesh rotation={[-(Math.PI / 2), 0.1, 1]} castShadow>
        <torusGeometry args={[0.8, 0.4, 50, 50]} />
        <meshStandardMaterial
          map={texture}
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={1}
        />
      </mesh>
    </Center>
  );
}

export function E3({ texture, roughness }: { texture: any; roughness: number }) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0);

  useEffect(() => {
    if (texture) {
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <Center top>
      <mesh castShadow>
        <planeGeometry args={[1.4, 1.4]} />
        <meshStandardMaterial
          map={texture}
          metalness={1}
          roughness={roughness}
          transparent={true}
          opacity={1}
          side={THREE.DoubleSide}
          shadowSide={THREE.DoubleSide}
        />
      </mesh>
    </Center>
  );
}
