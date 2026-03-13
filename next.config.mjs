/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  outputFileTracingRoot: new URL(".", import.meta.url).pathname,
};

export default nextConfig;
