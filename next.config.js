/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'vxquljeazujpsufkckhp.supabase.co', // SEU DOMÍNIO REAL DO SUPABASE
    ],
    unoptimized: true, // <-- CERTIFIQUE-SE QUE ESTA LINHA ESTÁ AQUI
  },
  // ... outras configurações que já existam
};

module.exports = nextConfig;