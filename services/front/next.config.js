/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_SERVER: process.env.API_SERVER,
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;
