/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/settings",
        destination: "/settings/profile",
      },
    ];
  },
};

export default nextConfig;
