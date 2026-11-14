/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Em desenvolvimento, abrir o site por outro endereço que não "localhost"
  // (ex.: o IP da rede, http://192.168.x.x:3000) bloqueia os scripts do Next
  // e a página nunca hidrata. Liberamos localhost e a rede local.
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.*.*", "10.*.*.*", "*.local"],
};

export default nextConfig;
