
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['vxquljeazujpsufkckhp.supabase.co'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'vxquljeazujpsufkckhp.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
        unoptimized: true,
    },
    experimental: {
        allowedDevOrigins: [
            '*.replit.dev',
            '*.picard.replit.dev'
        ],
    },
}

module.exports = nextConfig
