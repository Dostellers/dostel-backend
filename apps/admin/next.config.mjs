import path from 'path';

// Existing Next config for apps/admin. Adds allowedDevOrigins so nip.io Host
// can load /_next chunks (logs blocked admin.dostel.*.nip.io). Rewrites /graphql
// to backend :5400 for LoginForm fetch('/graphql').
// User instruction: "fix it"
const nextConfig = {
  allowedDevOrigins: [
    '65.109.113.80',
    'admin.dostel.65.109.113.80.nip.io',
    'admin.dostellers.com',
    'dostellers.com',
    'www.dostellers.com',
  ],
  async rewrites () {
    const api =
      process.env.ADMIN_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://127.0.0.1:5400'
    return [
      {
        source: '/graphql',
        destination: `${api.replace(/\/$/, '')}/graphql`,
      },
    ]
  },
  turbopack: {
    resolveAlias: {
      '@': path.resolve('./'),
    },
  },
};

export default nextConfig;