/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
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
    domains: ['awqmtbteouvahhaqtspj.supabase.co'],
  },
};
export default nextConfig;