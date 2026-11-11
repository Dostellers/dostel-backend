import path from "node:path";

const nextConfig = {
  // Called by Next.js itself at boot (apps/frontend/next.config.js) — sole
  // Next config for the guest app; no second config serves this purpose.
  // Without nip.io here, DestinationField/DateRangeField client handlers never
  // hydrate over Host: dostel.65.109.113.80.nip.io (chunks blocked).
  // User: "the property selector ui is not good"
  allowedDevOrigins: [
    "65.109.113.80",
    "dostel.65.109.113.80.nip.io",
    "admin.dostel.65.109.113.80.nip.io",
  ],
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
