/** @type {import("next").NextConfig} */
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const nextConfig = {
	output: "standalone",
	basePath: process.env.NEXT_PUBLIC_CONTEXT_PATH,
	experimental: {
		outputFileTracingRoot: path.join(__dirname, "../../"),
		serverActions: true,
	},
	headers() {
		return [
			{
				source: "/",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
				],
			},
		];
	},
	// webpack: (config, { isServer }) => {
	// 	if (isServer) {
	// 		config.externals = nodeExternals();
	// 	}
	// 	return config;
	// },
};

module.exports = nextConfig;
