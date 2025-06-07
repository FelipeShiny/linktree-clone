
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['vxquljeazujpsufkckhp.supabase.co'],
        unoptimized: true,
    },
    experimental: {
        serverComponentsExternalPackages: ['@supabase/supabase-js'],
    },
}

module.exports = nextConfig
