'use client';

import {
  AccumulativeShadows,
  Environment,
  Loader,
  OrbitControls,
  RandomizedLight,
  useTexture
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { addItem } from 'components/cart/actions';
import { useCart } from 'components/cart/cart-context';
import { useProduct } from 'components/product/product-context';
// import ProductImageZoom from 'components/product/product-image-zoom';
import 'katex/dist/katex.min.css';
import { Product } from 'lib/types';
import { dynamicSizeLabels, formatPrice } from 'lib/utils';
import { Link } from 'next-view-transitions';
import { Suspense, useActionState, useMemo, useRef, useState, useTransition } from 'react';
import Latex from 'react-latex-next';
import ImageWrapper from '../image-wrapper';
import { E3, Klein, MobiusStrip, Sphere, Torus } from './geometry';
import s from './product-details.module.css';

function Geometry({ textureUrl, id, activeControl }) {
  const texture = useTexture(textureUrl);
  const controlToGeometry = useMemo(
    () => ({ 1: E3, 2: Torus, 3: Sphere, 4: Klein, 5: MobiusStrip }),
    []
  );
  const ActiveGeometry = controlToGeometry[activeControl as keyof typeof controlToGeometry];

  // Bad! I know! Don't blame me! Blame fourthwall! I swear its not me!
  // Conditional rendering with the usual {x && <...>} breaks because of the whitespace induced by the first term
  if (activeControl === 0) {
    return <></>;
  } else {
    return <ActiveGeometry texture={texture} key={id} roughness={0.37} />;
  }
}

export default function ProductDetails({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
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

  const sizes = useMemo(
    () => product.options.find((x) => x.id === 'size')?.values.slice(0, 5),
    [product]
  );
  const colors = useMemo(
    () =>
      product.options
        .find((x) => x.id === 'color')
        ?.values.map((x) => {
          const [hex, name] = x.split(':');
          return { hex, name };
        }),
    [product]
  );
  const sizeLabels = useMemo(() => dynamicSizeLabels(sizes!), [product]);

  const galleryScroll = useMemo(() => {
    return (id: string) => {
      try {
        // @ts-ignore
        galleryRef.current.scrollTo({
          behavior: 'smooth',
          top:
            document.getElementById(id)!.getBoundingClientRect().top -
            // @ts-ignore
            galleryRef.current.getBoundingClientRect().top -
            30
        });
      } catch {}
    };
  }, []);

  const updateVariant = useMemo(() => {
    return ({
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
  }, [product]);

  return (
    <div className={s.prodContainer}>
      <Link className={s.backLink} href="/" prefetch={true}>
        <Latex>$f^{`{-1}`}$</Latex>
      </Link>
      <div className={s.prodInner}>
        <div className={s.prodGallery} ref={galleryRef}>
          {product.variants[activeVariant]?.images.map(({ url }, i) => (
            <div
              key={`gal-${i}`}
              id={`gal-${i}`}
              className={`${s.prodGalleryItem} ${activeImage === i ? s.active : ''}`}
              onClick={() => {
                if (activeImage !== i) {
                  setActiveImage(i);
                  setActiveImageUrl(product.variants[activeVariant]?.images[activeImage]?.url);
                  galleryScroll(`gal-${i}`);
                }
              }}
            >
              <ImageWrapper
                priority={true}
                width={89}
                height={119}
                alt="shirt"
                src={url}
                className={s.prodGalleryImg}
              />
            </div>
          ))}
        </div>

        <div className={s.prodStage}>
          <div className={s.prodCanvasWrapper}>
            <div className={`${s.prodActiveImg}  ${activeControl !== 0 ? s.inactive : ''}`}>
              <ImageWrapper
                priority={true}
                width={300}
                height={700}
                alt="shirt"
                src={product.variants[activeVariant]?.images[activeImage]?.url || ''}
              />
            </div>
            <Canvas shadows camera={{ position: [0, 0, 3.6], fov: 50 }}>
              <group position={[0, -0.65, 0]}>
                <Suspense fallback={null}>
                  <Geometry
                    textureUrl={product.variants[activeVariant]?.images[activeImage].url}
                    // @ts-ignore
                    id={product.variants[activeVariant]?.images[activeImage].id}
                    activeControl={activeControl}
                  />
                </Suspense>
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
              <Environment preset="dawn" background blur={0.34} />
              <OrbitControls
                autoRotate
                autoRotateSpeed={0.1}
                enablePan={false}
                enableZoom={true}
                maxDistance={15}
                minPolarAngle={Math.PI / 2.1}
                maxPolarAngle={Math.PI / 2.1}
              />
            </Canvas>
            <Loader
              containerStyles={{ background: 'rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(5px)' }}
              barStyles={{ background: 'rgba(1,1,1,0.4)' }}
              innerStyles={{ background: 'rgba(255, 255, 255, 0.3' }}
            />
          </div>
          <div className={s.prodControls}>
            {controls.map((tex, i) => (
              <div
                key={`control-${i}`}
                className={`${s.prodControl} ${activeControl === i ? s.prodControlActive : ''}`}
                onClick={() => setActiveControl(i)}
              >
                <Latex>${tex}$</Latex>
              </div>
            ))}
          </div>
        </div>
        <div className={s.prodInfo}>
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
