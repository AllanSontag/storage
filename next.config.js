/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    EDGE_CONFIG: process.env.EDGE_CONFIG,
    EDGE_CONFIG_ID: process.env.EDGE_CONFIG_ID,
    EDGE_CONFIG_TOKEN: process.env.EDGE_CONFIG_TOKEN,
  },
}

module.exports = nextConfig
