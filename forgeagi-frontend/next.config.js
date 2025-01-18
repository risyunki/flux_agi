/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/enter',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 