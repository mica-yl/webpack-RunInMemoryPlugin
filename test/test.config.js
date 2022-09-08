const RunInMemoryPlugin = require('../RunInMemoryPlugin');

const webpack = require('webpack');
const { resolve } = require('path');

/** @type {webpack.Configuration} */
const config = {
  mode: 'development',
  target: 'node',
  entry: {
    app: [
      resolve(__dirname, './entry.js'),

    ],
  },

  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, '.'),
  },
  plugins: [
    new RunInMemoryPlugin({}),
  ],
  watchOptions: {

  }
};

if (true) {
  config.entry.app.push(resolve(__dirname, '../node_modules/webpack/hot/poll?1000'));
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}


module.exports = [config];