import path from 'path';
import webpack from 'webpack'; // eslint-disable-line import/no-extraneous-dependencies

import alias from './aliases';

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

export default {
  target: 'web',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
  ],
  entry: [
    './src/containers/index.js'
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'reddit-comments.min.js',
    library: 'reddit-comments',
    libraryTarget: 'umd'
  },
  externals: [{
    react: 'react',
    'react-dom': 'react-dom'
  }],
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
    alias
  }
};
