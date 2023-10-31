/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    basePath: process.env.NEXT_PUBLIC_CONTEXT_PATH
}

module.exports = nextConfig
