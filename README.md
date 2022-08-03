# RunInMemoryPlugin 

## what is this ?

This is a webpack plugin to do build in memory instead of disk and then require a it to run it from memory.

## how to use?

add a new instance of the plugin to plugins array and provide it with options object has `reqireFile` property to be required once after build. 


example : `webpack.config.js`

```javascript
const path = require('path');
module.exports = {
 mode: 'development',
 entry: {
    server: [path.resolve(__dirname, './server/index.ts')],

  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    libraryTarget: 'commonjs2',
  },
  // ...
  plugins: [
 // ...
    new RunInMemoryPlugin({ 
      requireFile: path.join(__dirname, './dist/server.bundle.js') 
      }),
  ],
  // ...
};
```