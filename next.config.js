// /** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();
module.exports = {
  ...removeImports({}),
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
