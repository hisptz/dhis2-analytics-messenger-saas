/** @type {import("next").NextConfig} */
const path = require("path");
const nextConfig = {
	output: "standalone",
	basePath: process.env.NEXT_PUBLIC_CONTEXT_PATH,
	experimental: {
		outputFileTracingRoot: path.join(__dirname, "../../"),
	},
};

module.exports = nextConfig;
