/* eslint-disable */
'use strict';

const babelJest = require('babel-jest');
require('babel-register');
const webpackAlias = require('jest-webpack-alias');

module.exports = {
  process: (src, filename) => {
    let newSrc = src;
    if (filename.indexOf('node_modules') === -1) {
      newSrc = babelJest.process(newSrc, filename);
      newSrc = webpackAlias.process(newSrc, filename);
    }

    return newSrc;
  }
};
