/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api/* calls to the NestJS backend during development,
  // but exclude /api/auth/* which is handled by NextAuth.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/api/auth/:path*',
          destination: '/api/auth/:path*',
        },
      ],
      fallback: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
