import path from 'path';

const nextConfig = {
  turbopack: {
    resolveAlias: {
      '@': path.resolve('./'),
    },
  },
};

export default nextConfig;