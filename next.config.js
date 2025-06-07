
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
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                ],
            },
        ];
    },
}

module.exports = nextConfig
