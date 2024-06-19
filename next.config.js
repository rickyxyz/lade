// /** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const removeImports = require("next-remove-imports")();
module.exports = {
  ...removeImports({}),
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
