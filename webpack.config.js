const { resolve } = require('node:path')

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.module\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[path][local]-[hash:base64:5]',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(jpg|png|svg|woff2)$/,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'build'),
        assetModuleFilename: 'f/[hash][ext]',
    },
    devServer: {
        static: {
            directory: resolve(__dirname, 'public'),
        },
        allowedHosts: [
            'mmorpg.aaa',
        ],
        historyApiFallback: {
            index: '/index.html',
        },
        host: 'mmorpg.aaa',
        port: 30080,
    },
}
