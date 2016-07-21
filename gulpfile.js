var gulp = require('gulp');
var express = require('express');
var modRewrite = require('connect-modrewrite');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var app = require('./server');
var livereload = require('gulp-livereload');
var nodemon = require('nodemon');
var Server = require('karma').Server;
var mocha = require('gulp-mocha');

gulp.task('server', function() {
  require('babel-core/register');
  require('babel-polyfill');
  var compiler = webpack(require('./webpack.config'));

  // webpack client-side spa and serve static components
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: '/client'
  }));

  app.listen(8080, function() {
    console.log('Listening on port 8080');
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
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test-server', function (done) {
  return gulp
    .src('./test/server/index.js', {read: false})
    .pipe(mocha({reporter: 'nyan'})); // hehe
});

gulp.task('serve', ['server', 'watch']);

gulp.task('test', ['test-client', 'test-server']); // TODO: add task for linting