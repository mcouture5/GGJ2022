var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
var pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(pathToPhaser, 'dist/phaser.js');

module.exports = {
    entry: './src/game.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.[contenthash].js',
        clean: true
    },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: './index.html'
        }),
        new CopyPlugin({
            patterns: [{
                from: "./assets/**/*"
            }],
        })
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader',
            exclude: '/node_modules/'
        }]
    },
    devServer: {
        static: {
            directory: './src',
            watch: {
                ignored: '/node_modules/',
                usePolling: false
            }
        },
        host: '127.0.0.1',
        port: 8080,
        watchFiles: ['./src/**/*', './index.html', './assets/**/*']
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            phaser: phaser
        }
    }
};