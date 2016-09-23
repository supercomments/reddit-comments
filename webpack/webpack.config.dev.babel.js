import path from 'path';

import alias from './aliases';

export default {
  debug: true,
  target: 'web',
  devtool: 'sourcemap',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'reddit-comments.app.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$|\.js$/,
      loaders: ['babel-loader'],
      include: path.resolve(__dirname, '../src')
    }, {
      test: /\.png$/,
      loaders: ['url-loader'],
      include: path.resolve(__dirname, '../src/assets')
    }]
  },
  resolve: {
    extensions: ['', '.js'],
    root: path.resolve(__dirname, '../'),
    alias
  }
};
