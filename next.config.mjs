/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["fluent-ffmpeg", "ffmpeg-static", "yt-dlp-wrap"],
  },
};

export default nextConfig;
