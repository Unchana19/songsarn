/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ]
      }
    ]
  },
  images: {
    domains: ['songsarn-project.s3.ap-southeast-1.amazonaws.com', 'lh3.googleusercontent.com/a/'],
  },
}

module.exports = nextConfig
