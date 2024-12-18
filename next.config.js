/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };

    Object.defineProperty(config, 'devtool', {
      get() {
        return 'source-map';
      },
      set() {},
    });

    return config;
  },
};

module.exports = nextConfig;
