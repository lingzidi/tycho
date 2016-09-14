module.exports = function (config) {
  config.set({
    frameworks: [
      'jasmine',
      'mocha',
      'chai',
      'sinon-chai'
    ],

    reporters: [
      'spec',
      'coverage'
    ],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './node_modules/three/build/three.min.js',
      './node_modules/moment/moment.js',
      'tests/client/index.js'
    ],

    preprocessors: {
      'tests/client/index.js': ['webpack', 'sourcemap']
    },

    browsers: [
      'PhantomJS2'
      // 'Chrome',
      // 'Firefox'
    ],

    singleRun: true,

    coverageReporter: {
      dir: 'build/coverage/',
      type: 'html'
    },

    client: {
      // captureConsole: false
    },

    logLevel: config.LOG_DEBUG,

    webpack: require('./tests/client/webpack.tests'),

    webpackMiddleware: {
      noInfo: true,
      quiet: true,
      stats: {
        colors: true
      }
    },

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered 
      // (useful if karma exits without killing phantom) 
      exitOnResourceError: true
    }
  });
};