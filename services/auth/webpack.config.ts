import path from "path";

module.exports = {
		mode: 'production',
		target: "node",
		entry: './src/main.ts',
		output: {
				filename: 'main.js',
				path: path.resolve(__dirname, 'cloud'),
		},
		optimization: {
				minimize: true
		},
		resolve: {
				extensions: ['.tsx', '.ts', '.js'],
		},
		module: {
				rules: [
						{
								test: /\.tsx?$/,
								use: 'ts-loader',
								exclude: /node_modules/,
						},
				],
		},
};
