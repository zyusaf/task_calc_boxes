const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
     patterns: [
// TODO : Enable this if you have any static asses you need to include
//      { from: 'static', to: 'static' },
      { from: 'index.html', to: 'index.html', toType: 'file'},
    ]}),
  ],
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html/,
        type: 'asset/resource',
//        generator: {
//             filename: './index[ext]'
//       }
     },
     {
       test: /\.css$/,
       use:[
         'style-loader',
         'css-loader'
       ]
     }
    ],
  },
  resolve: {
    extensions: ['.ts', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: './dist',
  },
};
