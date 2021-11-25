import webpack from 'webpack'
import path from 'path'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default {
    mode: 'development',
    entry: {
        app: path.join(__dirname, 'web/src/main.tsx'),
    },
    output: {
        path: path.join(__dirname, 'web/dist'),
        filename: 'main.js',
        publicPath: 'web/dist',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre',
            },
            {
                test: /\.(sc|c)ss$/,
                use: ['cache-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [new MiniCssExtractPlugin() as any],
    optimization: {},
    resolve: {
        modules: [path.join(__dirname, 'node_modules')],
        extensions: ['.js', '.json', '.ts', '.tsx', '.css', '.scss'],
    },
} as webpack.Configuration
