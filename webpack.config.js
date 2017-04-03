var path = require('path');
var webpack = require('webpack');

module.exports = function (env) {
    env = env || {};

    var config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'tiny-observables.js',
            library: 'Observe'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    options: {"presets": ["es2015"]}
                }
            ]
        },
        plugins: []
    };

    if (env.prod) {
        config.plugins.push(
            new webpack.LoaderOptionsPlugin({minimize: true, debug: false}),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {screw_ie8: true, keep_fnames: true},
                compress: {screw_ie8: true},
                comments: false
            })
        )
    }

    return config;
};