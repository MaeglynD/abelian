'use client';

import { useRef, useState } from 'react';

export default function ProductImageZoom({
  src,
  zoomScale,
  isActive
}: {
  src: string;
  zoomScale: number;
  isActive: boolean;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [XY, setXY] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current || !isActive) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();

    setXY({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
  };

  return (
    <div
      className={`relative overflow-hidden flex justify-center items-center transition-opacity duration-200 ${!isActive ? 'opacity-0' : 'opacity-100'}`}
    >
      <img
        src={src}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className="absolute w-fit h-full object-cover transition-transform duration-200 opacity-0 z-10 cursor-crosshair !max-h-[300px]"
      />
      <img
        ref={imgRef}
        src={src}
        className="w-fit h-full object-cover transition-transform duration-500"
        style={{
          transform: isHovering ? `scale(${zoomScale})` : 'scale(1)',
          transformOrigin: `${XY.x}% ${XY.y}%`
        }}
      />
    </div>
  );
}
