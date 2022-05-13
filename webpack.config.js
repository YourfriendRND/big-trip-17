const path = require("path");
const CopyPlugin = require("copy-webpack-plugin")

const copyPluginInstance = new CopyPlugin({
    patterns: [{ from: "public" }]
});

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
    devtool: 'source-map',
    plugins: [
        copyPluginInstance,
    ],
    devServer: {
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}