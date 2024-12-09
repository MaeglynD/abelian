'use client';

import {
  AccumulativeShadows,
  Center,
  Environment,
  OrbitControls,
  RandomizedLight,
  useTexture
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import { useProduct } from 'components/product/product-context';
import 'katex/dist/katex.min.css';
import { Leva, useControls } from 'leva';
import { Image, Product } from 'lib/types';
import { dynamicSizeLabels, formatPrice } from 'lib/utils';
import { Link } from 'next-view-transitions';
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import Latex from 'react-latex-next';
import * as THREE from 'three';
// @ts-ignore
import { ParametricGeometries } from 'three/addons/geometries/ParametricGeometries.js';
// @ts-ignore
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import s from './product-details.module.css';

function Env() {
  const [preset, setPreset] = useState('dawn');
  // You can use the "inTransition" boolean to react to the loading in-between state,
  // For instance by showing a message
  const [inTransition, startTransition] = useTransition();
  const { blur } = useControls({
    blur: { value: 0.34, min: 0, max: 1 },
    preset: {
      value: preset,
      options: [
        'sunset',
        'dawn',
        'night',
        'warehouse',
        'forest',
        'apartment',
        'studio',
        'city',
        'park',
        'lobby'
      ],
      // If onChange is present the value will not be reactive, see https://github.com/pmndrs/leva/blob/main/docs/advanced/controlled-inputs.md#onchange
      // Instead we transition the preset value, which will prevents the suspense bound from triggering its fallback
      // That way we can hang onto the current environment until the new one has finished loading ...
      onChange: (value) => startTransition(() => setPreset(value))
    }
  });
  // @ts-ignore
  return <Environment preset={preset} background blur={blur} />;
}

function Klein({ texture, roughness }: { texture: any; roughness: number }) {
  const geometry = useMemo(() => {
    return new ParametricGeometry(ParametricGeometries.klein, 100, 20);
  }, []);

  /* @ts-ignore */
  texture.wrapS = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.wrapT = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.repeat.set(5, 13);
  // /* @ts-ignore */
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

function Sphere({ texture, roughness }: { texture: any; roughness: number }) {
  /* @ts-ignore */
  texture.wrapS = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.wrapT = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.repeat.set(2, 1);
  /* @ts-ignore */
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

function MobiusStrip({ texture, roughness }: { texture: any; roughness: number }) {
  const geometry = useMemo(() => {
    return new ParametricGeometry(ParametricGeometries.mobius, 100, 20);
  }, []);

  /* @ts-ignore */
  texture.wrapS = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.wrapT = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.repeat.set(1, 14);
  /* @ts-ignore */
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

function Torus({ texture, roughness }: { texture: any; roughness: number }) {
  /* @ts-ignore */
  texture.wrapS = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.wrapT = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.repeat.set(11, 3);
  /* @ts-ignore */
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

function E3({ texture, roughness }: { texture: any; roughness: number }) {
  /* @ts-ignore */
  texture.wrapS = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.wrapT = THREE.RepeatWrapping;
  /* @ts-ignore */
  texture.repeat.set(1, 1);
  /* @ts-ignore */
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

function GeometryContainer({
  imgs,
  imgIndex,
  activeControl
}: {
  imgs: Image[];
  imgIndex: number;
  activeControl: number;
}) {
  const { roughness } = useControls({
    roughness: { value: 0.37, min: 0, max: 1 }
  });
  const textures = useTexture(imgs.map((x) => x?.url || ''));
  const controlToGeometry = useMemo(
    () => ({ 1: E3, 2: Torus, 3: Sphere, 4: Klein, 5: MobiusStrip }),
    []
  );
  // @ts-ignore
  const ActiveGeometry = controlToGeometry[activeControl];
  // const roughness = 0.37;

  // Conditional rendering with the usual {x && <...>} breaks because of the whitespace induced by the first term
  if (activeControl === 0) {
    return <></>;
  } else {
    return (
      <ActiveGeometry
        texture={textures[imgIndex]}
        key={imgs[imgIndex]!.url}
        roughness={roughness}
      />
    );
  }
}

export function ProductDetails({ product }: { product: Product }) {
  const [activeControl, setActiveControl] = useState(0);
  const [activeVariant, setActiveVariant] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [activeImageUrl, setActiveImageUrl] = useState(
    product.variants[activeVariant]?.images[activeImage]?.url
  );
  const galleryRef = useRef(null);
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const controls = [
    '\\emptyset',
    '\\ \\mathbb{E^3}',
    '\\ \\mathbb{T^2}',
    '\\ \\mathbb{S^2}',
    '\\mathbb{K}',
    '\\mathbb{M}'
  ];

  const sizes = product.options.find((x) => x.id === 'size')?.values.slice(0, 5);
  const colors = product.options
    .find((x) => x.id === 'color')
    ?.values.map((x) => {
      const [hex, name] = x.split(':');
      return { hex, name };
    });
  // @ts-ignore
  const sizeLabels = useMemo(() => dynamicSizeLabels(sizes), [product]);

  const galleryScroll = (id: string) => {
    try {
      // @ts-ignore
      galleryRef.current.scrollTo({
        behavior: 'smooth',

        top:
          // @ts-ignore
          document.getElementById(id)?.getBoundingClientRect().top -
          // @ts-ignore
          galleryRef.current.getBoundingClientRect().top -
          30
      });
    } catch {}
  };

  const updateVariant = ({
    size = product.variants[activeVariant]?.selectedOptions.size,
    color = product.variants[activeVariant]?.selectedOptions.color
  }) => {
    setActiveImage(0);
    setActiveVariant(
      product.variants.findIndex(
        (x) => x.selectedOptions.size === size && x.selectedOptions.color === color
      )
    );
    galleryScroll('gal-0');
  };

  return (
    <div className={s.container}>
      <Link className={s.backLink} href="/" prefetch={true}>
        <Latex>$f^{`{-1}`}$</Latex>
      </Link>

      <div className={s.innerContainer}>
        <div className={s.gallery}>
          <div className={s.galleryInner} ref={galleryRef}>
            {product.variants[activeVariant]?.images.map(({ url }, i) => (
              <div
                key={`gal-${i}`}
                id={`gal-${i}`}
                className={`${s.galleryItem} ${activeImage === i ? s.activeGalleryImg : ''}`}
                onClick={() => {
                  if (activeImage !== i) {
                    setActiveImage(i);
                    setActiveImageUrl(product.variants[activeVariant]?.images[activeImage]?.url);
                    galleryScroll(`gal-${i}`);
                  }
                }}
              >
                <img src={url} className={s.galleryImg} />
              </div>
            ))}
          </div>
        </div>

        <div className={s.showcase}>
          <img
            src={product.variants[activeVariant]?.images[activeImage]?.url || ''}
            className={`${activeControl !== 0 ? s.hiddenImage : ''}`}
          />
          <div
            className={s.canvasContainer}
            // style={{ display: `${activeControl === 0 ? 'none' : ''}` }}
            style={{ zIndex: `${activeControl === 0 ? '-1' : '2'}` }}
          >
            <Canvas shadows camera={{ position: [0, 0, 3.6], fov: 50 }}>
              <group position={[0, -0.65, 0]}>
                <GeometryContainer
                  imgs={product.variants[activeVariant]?.images!}
                  imgIndex={activeImage}
                  activeControl={activeControl}
                />
                <AccumulativeShadows
                  temporal
                  frames={200}
                  color="purple"
                  colorBlend={0.5}
                  opacity={1}
                  scale={10}
                  alphaTest={0.85}
                >
                  <RandomizedLight
                    amount={8}
                    radius={5}
                    ambient={0.5}
                    position={[5, 3, 2]}
                    bias={0.001}
                  />
                </AccumulativeShadows>
              </group>
              <Env />
              <OrbitControls
                // autoRotate
                autoRotateSpeed={0.3}
                enablePan={false}
                enableZoom={true}
                // maxDistance={7}
                minPolarAngle={Math.PI / 2.1}
                maxPolarAngle={Math.PI / 2.1}
              />
            </Canvas>
            <Leva collapsed hidden />
          </div>

          <div className={s.showcaseControls}>
            {controls.map((tex, i) => (
              <div
                key={`control-${i}`}
                className={`${s.showcaseControl} ${activeControl === i ? s.controlActive : ''}`}
                onClick={() => setActiveControl(i)}
              >
                <Latex>${tex}$</Latex>
              </div>
            ))}
          </div>
        </div>

        <div className={s.descriptionContainer}>
          <div className={s.descriptionUpperHalf}>
            <div className={s.title}>
              <Latex>$\text{`{${product.title}}`}$</Latex>
            </div>

            <div className={s.description}>
              <Latex>$\text{`{${product.description}}`}$</Latex>
            </div>
          </div>
          <div className={s.descriptionLowerHalf}>
            {sizes && (
              <div className={s.sizes}>
                {sizes.map((size, i) => (
                  <div
                    key={`${size}-i`}
                    className={`${s.size} ${product.variants[activeVariant]?.selectedOptions.size === size ? s.activeSize : ''}`}
                    onClick={() => updateVariant({ size })}
                  >
                    {/* @ts-ignore */}
                    <Latex>$\ \aleph_{`{\\mathcal{${sizeLabels[size]}}}`}$</Latex>
                  </div>
                ))}
              </div>
            )}

            {colors && (
              <div className={s.colors}>
                {colors.map(({ hex, name }, i) => (
                  <div
                    key={`${hex}-${i}`}
                    className={s.color}
                    onClick={() => updateVariant({ color: name })}
                  >
                    <div
                      style={{ background: hex }}
                      className={`${s.swatch} ${product.variants[activeVariant]?.selectedOptions.color === name ? s.activeColor : ''}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className={s.price}>
              <Latex>$\text{`{${formatPrice(product.variants[activeVariant]!.price)}}`}$</Latex>
            </div>

            <form
              action={async () => {
                addCartItem(product.variants[activeVariant]!, product);
                await formAction.bind(null, product.variants[activeVariant]!.id)();
              }}
            >
              <button className={s.addToCart}>
                <Latex>$\text{`{Add to Cart}`}$</Latex>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
