/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for Next.js 13.4.12
  output: 'export',
  // Disable image optimization since it's not compatible with static export
  images: {
    unoptimized: true,
  },
  // Turn off experimental features that might cause issues
  experimental: {
    // No experimental features needed
  }
}

module.exports = nextConfig 