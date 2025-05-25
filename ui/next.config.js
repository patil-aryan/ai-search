/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/news',
        destination: 'https://newsapi.org/v2/top-headlines'
      },
      {
        source: '/api/weather/:path*',
        destination: 'https://api.openweathermap.org/data/2.5/:path*'
      }
    ];
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig; 