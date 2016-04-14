var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/js/');
var SRC_DIR = path.resolve(__dirname, 'ui');

var config = {
  entry: SRC_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'app.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel'
      }
    ]
  }
};

module.exports = config;
