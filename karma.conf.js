module.exports = function (config) {
  config.set({
    frameworks: [
      'jasmine'
    ],

    reporters: [
      'spec',
      'coverage'
    ],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      'test/client/index.js'
    ],

    preprocessors: {
      'test/client/index.js': ['webpack', 'sourcemap']
    },

    browsers: [
      'PhantomJS'
    ],

    singleRun: true,

    coverageReporter: {
      dir: 'build/coverage/',
      type: 'html'
    },

    webpack: require('./test/client/webpack.tests'),

    webpackMiddleware: { // hide webpack output
      noInfo: true
    }
  });
};