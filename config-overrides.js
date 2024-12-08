const webpack = require('webpack');

module.exports = function override(config) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "process": require.resolve("process/browser.js"),
        "buffer": require.resolve("buffer"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url"),
        "path": require.resolve("path-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "querystring": require.resolve("querystring-es3"),
        "child_process": false,
        "fs": false,
        "net": false,
        "tls": false
    };

    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: ['process/browser.js', 'process'],
            Buffer: ['buffer', 'Buffer']
        }),
        new webpack.NormalModuleReplacementPlugin(
            /node:/, (resource) => {
                resource.request = resource.request.replace(/^node:/, "");
            }
        )
    ];

    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
}
