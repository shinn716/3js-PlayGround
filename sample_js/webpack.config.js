const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: "development",
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'

        }),
    ],
    module: {
        rules: [{
            test: /\.(png|jpe?g|gif)$/,
            use: {
                loader: "file-loader",
                options: {
                    outputPath: 'img/'

                }

            }
        }]
    },
    devServer: {
        static: "./build",
        open: true,
        port: 8888
    },
    /* 
	three-mesh-ui on webpack5 issue	https://lightrun.com/answers/felixmariotto-three-mesh-ui-three-mesh-ui-and-webpack
	*/
    resolve: {
        alias: {
            'three-mesh-ui': path.resolve( __dirname, 'node_modules/three-mesh-ui/src/three-mesh-ui.js' ),
        },
    }
}
