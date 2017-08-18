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
var app = require('./server');
var log = require('single-line-log').stdout;

gulp.task('server', function() {
  require('babel-core/register');
  require('babel-polyfill');

  var config = require('./webpack.config');

//config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/",
 //"webpack/hot/dev-server");

  var compiler = webpack(config);

  // webpack client-side SPA and serve static components
  app.use(webpackDev(compiler, {
    quiet: true,
    noInfo: true,
    stats: { colors: true },
    publicPath: '/client',
    hot: true// plz work omg
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


gulp.task('watch', function() {
  nodemon({
    script: './server/index.js'
  }).on('readable', function() {
    this.stdout.on('data', function(chunk) {
      if (/^listening/.test(chunk)) {
        livereload.reload();
      }
      process.stdout.write(chunk);
    });
  });
});


gulp.task('test-client', function (done) {
  var server = new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, process.exit);

  server.start();
});


gulp.task('test-server', function (done) {
  return gulp
    .src('./tests/server/index.es6', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});


gulp.task('serve', ['server', 'watch']);


gulp.task('test', ['test-client', 'test-server']); // TODO: add task for linting
