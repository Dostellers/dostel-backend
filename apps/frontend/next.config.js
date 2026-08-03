import path from "node:path";

const nextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), "../../"),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "static.thehosteller.com" },
    ],
  },
};

export default nextConfig;
