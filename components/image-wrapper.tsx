'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageWrapper(props: any) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      <Image
        {...props}
        onLoad={() => setIsLoaded(true)}
        className={`
          ${props.className || ''} 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300 ease-in-out
        `}
        priority={true}
      />
    </div>
  );
}
