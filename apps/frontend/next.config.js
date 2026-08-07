import path from "node:path";

const nextConfig = {
  // The team reviews the dev server over the box's public IP. Without this,
  // Next blocks cross-origin asset/HMR requests, hydration never runs, and
  // any client-gated UI silently stays in its server-rendered state.
  allowedDevOrigins: ["65.109.113.80"],
  // Multiple agents run auto-respawning dev servers in this directory under
  // different users (the platform keeps a paperclip one on :3001; other
  // agents have launched root ones). Two servers sharing one .next corrupt
  // each other's manifests — root-owned files the paperclip server cannot
  // rewrite knocked whole routes out of the router (404s in the primary nav).
  // Splitting the dist dir by euid makes cross-user poisoning impossible.
  distDir:
    process.env.NEXT_DIST_DIR ||
    (typeof process.getuid === "function" && process.getuid() === 0
      ? ".next-root"
      : ".next"),
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
