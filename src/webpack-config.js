module.exports.rules = [{
	test: /\.s[ac]sshbs$/,
	use: [
		'handlebars-loader',
		'injector-loader',
		'postcss-loader',
		'sass-loader',
	],
}, {
	test: /\.(?:c|le)sshbs$/,
	use: [
		'handlebars-loader',
		'injector-loader',
		'postcss-loader',
		'less-loader',
	],
}];

module.exports.resolveLoader = {
	modules: [ 'node_modules/@bitchcraft/injector/lib/webpack-loaders' ],
};
