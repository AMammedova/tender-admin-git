import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  images: {
    domains: ["tend.grandmart.az"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trustHost: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
