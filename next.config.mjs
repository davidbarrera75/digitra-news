/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/noticias/temporada-de-avistamiento-de-ballenas-en-colombia-una-experiencia-imperdible-705582",
        destination: "/destinos/temporada-de-avistamiento-de-ballenas-en-colombia-una-experiencia-imperdible",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
