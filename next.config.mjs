/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_KEY: process.env.API_KEY,
  },
};

export default nextConfig;
