import path from "node:path";

const nextConfig = {
  // The team reviews the dev server over the box's public IP. Without this,
  // Next blocks cross-origin asset/HMR requests, hydration never runs, and
  // any client-gated UI silently stays in its server-rendered state.
  allowedDevOrigins: ["65.109.113.80"],
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
