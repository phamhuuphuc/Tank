const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/game.ts',
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.css/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(jpg|png|svg|gif)$/,
            type: 'asset/resource',
          },
        ],
      },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'helloworld.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, '/dist/'),
        },
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Tank',
            filename: 'index.html'
        })
    ],
}