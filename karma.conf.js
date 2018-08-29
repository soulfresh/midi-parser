// Karma configuration
// Generated on Wed Mar 21 2018 14:33:30 GMT-0600 (MDT)
let path = require('path');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/test-context.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/test-context.js': ['webpack', 'sourcemap']
    },


    webpack: {
      // All of these suck for some reason or another.
      // TODO Investigate loading the files without Webpack.
      // devtool: 'none',
      // devtool: 'inline-source-map',
      // devtool: 'eval-source-map',
      // devtool: 'source-map',
      // devtool: 'inline-module-source-map',
      devtool: 'inline-cheap-module-source-map',
      // devtool: 'cheap-module-eval-source-map',
      // devtool: 'cheap-module-source-map',
      mode: 'development',
      resolve: {
        modules: [
          path.resolve(__dirname + '/src'),
          path.resolve(__dirname + '/node_modules')
        ],
        alias: {
          midi: path.resolve(__dirname + '/src/test/mocks/midi'),
          noble: path.resolve(__dirname + '/src/test/mocks/noble')
        }
      }
    },
    webpackServer: {
      noInfo: true
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'kjhtml'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
