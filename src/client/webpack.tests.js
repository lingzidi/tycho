var config = require('../../webpack.config');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

config.plugins = [
  new ExtractTextPlugin('styles.css', {allChunks: true}),
  new webpack.DefinePlugin({
    'DATA_SOURCE_URL': 'http://localhost:8080/api',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

module.exports = config;