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

gulp.task('server', function() {
  require('babel-core/register');
  require('babel-polyfill');
  var compiler = webpack(require('./webpack.config'));

  // webpack client-side SPA and serve static components
  app.use(webpackDev(compiler, {
    quiet: true,
    noInfo: true,
    stats: { colors: true },
    publicPath: '/client'
  }));

  app.listen(8080, function() {
    console.log('Listening on port 8080  🌎'.green);
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
    .src('./test/server/index.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});


gulp.task('serve', ['server', 'watch']);


gulp.task('test', ['test-client', 'test-server']); // TODO: add task for linting