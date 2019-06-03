/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const { peerDependencies } = require('./package.json');

const config = {
	context: path.resolve(__dirname),
	devtool: 'inline-source-map',
	entry: {
		injector: [
			'./src/index.js',
		],
	},
	externals: Object.keys(peerDependencies)
		.concat([
			'react-dom',
			'react-addons-transition-group',
		])
		.reduce((acc, dep) => {
			acc[dep] = `umd ${dep}`;
			return acc;
		}, {}),
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: '[name].es5.js',
		library: 'Injector',
		libraryTarget: 'umd',
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
	],
	module: {
		rules: [{
			test: /injector-loader\/index\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'file-loader',
				options: {
					name: 'injector-loader.js',
					outputPath: 'webpack-loaders',
				},
			},
		}, {
			test: /\.(js)?$/,
			exclude: /(node_modules|injector-loader)/,
			use: [{
				loader: 'babel-loader',
				query: {
					cacheDirectory: true,
					babelrc: true,
					plugins: [],
				},
			}],
		}],
	},
	resolve: {
		extensions: [ '.js', '.json' ],
	},
	resolveLoader: {
		modules: [ 'node_modules' ],
	},
};

module.exports = config;
