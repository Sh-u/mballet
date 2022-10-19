/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SERVER_URL: "http://127.0.0.1:7878"
  }
}

module.exports = nextConfig
