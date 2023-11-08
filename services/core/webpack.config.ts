import path from "path";

module.exports = {
	mode: "production",
	target: "node",
	entry: {
		parseServer: ["parse-server"],
		parseDashboard: ["parse-dashboard"],
		cloud: {
			import: "./src/cloud/main.ts",
			filename: "cloud/main.js",
		},
		app: {
			import: "./src/server.ts",
			filename: "server.js",
			dependOn: ["parseDashboard"],
		},
	},
	output: {
		environment: {
			globalThis: true,
			module: true,
		},
		path: path.resolve(__dirname, "app"),
	},
	optimization: {
		minimize: false,
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
};
