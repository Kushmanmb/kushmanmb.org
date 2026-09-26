const path = require('path');

module.exports = {
  entry: {
    symbols: './src/symbols.js',
    paylines: './src/paylines.js',
    reels: './src/reels.js',
    game: './src/game.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production'
};
