/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**"
      },
      new URL("https://avatar.vercel.sh/**")
    ]
  }
};

export default nextConfig;
