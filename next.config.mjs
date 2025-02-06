/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects(){
return [
  {
    source: '/',
    destination: '/home',
    permanent:false,
  }
]
  },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
            port: '',
            pathname: '/**',
            search: '',
          },
        ],
      },
};

export default nextConfig;
