var modRewrite = require('connect-modrewrite');
var webpackDev = require('webpack-dev-middleware');
var livereload = require('gulp-livereload');
var webpack = require('webpack');
var express = require('express');
var nodemon = require('nodemon');
var colors = require('colors');
var karma = require('karma');
var mocha = require('gulp-mocha');
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var log = require('single-line-log').stdout;

gulp.task('server', function() {
  require('babel-core/register');
  require('babel-polyfill');

  var config = require('./webpack.config');
  var compiler = webpack(config);
  var app = express();

  app.get('/', function(req, res) {
    fs.readFile(
      path.join(__dirname, './src/app/index.html'),
      (err, info) => {
        res.type('html');
        res.end(info);
      });
  });

  // webpack client-side SPA and serve static components
  app.use(webpackDev(compiler, {
    quiet: true,
    noInfo: true,
    stats: { colors: true },
    publicPath: '/client'
  }));

  app.listen(8080, function() {
    var phase = 0;
    var phases = ['🌏','🌍','🌎'],
        msg = 'Listening on port 8080';
    setInterval(function() {
      phase = ++phase % phases.length;
      log.clear();
      log((msg + ' \u0020' + phases[phase] + '\n').green);
    }, 200);
  });
});

gulp.task('test', function (done) {
  var server = new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, process.exit);

  server.start();
});

gulp.task('serve', ['server']);
