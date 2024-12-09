/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['three'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**'
      }
    ]
  }
};
