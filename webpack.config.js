const path = require('path');
// importuję bibliotękę [path] z [node.js]
const HtmlWebpackPlugin = require('html-webpack-plugin');
// importuję odpowiedni plugin
module.exports = {
    entry: {
        // client: './src/js/client.js',
        // admin: './src/js/admin.js'
        appAdmin: './src/js/appAdmin.js',
        appClient: './src/js/appClient.js'
    },
    // definiuje pliki wejściowe
    // posiadające swoje identyfikatory [chunks]
    output: {
        path: path.resolve(__dirname, 'build'),
        // definiuje ścieżką wyjściową
        filename: '[name].min.js',
        // definiuję nazwę pliku wyjściowego
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                // określam jakie pliki 
                // będą brane pod uwagę
                exclude: /node_modules/,
                // określam wykluczenia
                use: 'babel-loader',
                // określam jaki [loader]
                // ma być wykorzystany
            },
            {
                test: /\.css$/,
                // określam jakie pliki 
                // będą brane pod uwagę
                exclude: /node_modules/,
                // określam wykluczenia
                use: ['style-loader', 'css-loader'],
                // określam jaki [loader]
                // ma być wykorzystany
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // wskazuje plik źródłowy
            filename: 'index.html',
            // określan nazwę dla pliku
            // chunks: ['client'],
            chunks: ['appClient'],
            // wskazuje plik do podpięcia
        }),
        new HtmlWebpackPlugin({
            template: './src/admin.html',
            // wskazuje plik źródłowy
            filename: 'admin.html',
            // określan nazwę dla pliku
            chunks: ['appAdmin'],
            // wskazuje plik do podpięcia
        })
    ]
}
// eksportuję ustawienia dla webpack-a