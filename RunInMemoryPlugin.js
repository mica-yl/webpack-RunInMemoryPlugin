const { createFsFromVolume } = require("memfs");
const { Volume } = require("memfs");
const { ufs: hybridFs } = require('unionfs');
const solidFs = require('fs');
const { patchRequire } = require('fs-monkey');
const webpack = require("webpack");// for typescript
const { join } = require("path");

/* eslint-disable class-methods-use-this */
const pluginName = 'RunInMemoryPlugin';

class RunInMemoryPlugin {
  /**
   * @typedef {{requireFile:string}} RunInMemoryPluginOptions 
   * @param {RunInMemoryPluginOptions} options 
   */
  constructor(options) {
    this.isRunning = false;
    /**
     * a path to a js file to be required after complition
     */
    this.requireFile = options?.requireFile;
    const softVol = new Volume();
    const softFs = createFsFromVolume(softVol);
    hybridFs
      .use(solidFs)
      .use(softFs);
    this.softFs = softFs;
    this.hybridFs = hybridFs;

  }

  /**
   * 
   * @param {webpack.Compiler} compiler 
   */
  apply(compiler) {
    compiler.hooks.run.tap(
      pluginName, (compilation) => {
        // eslint-disable-next-line no-param-reassign
        compilation.outputFileSystem = this.softFs;
      });

    compiler.hooks.watchRun.tap(
      pluginName, (compilation) => {
        // eslint-disable-next-line no-param-reassign
        compilation.outputFileSystem = this.softFs;
      });
    // TODO can it run with tap ?
    compiler.hooks.afterEmit.tapAsync(
      pluginName,
      (compilation, next) => {
        if (!this.requireFile) {
          const assets = compilation.getAssets();
          this.requireFile = join(compiler.outputPath, assets[0].name);
          console.log(`did't provide a requireFile. using first asset of : ${assets}`);
        }
        next();
      },
    );

    compiler.hooks.afterDone.tap(
      pluginName, async () => {
        if (!this.isRunning) {
          this.isRunning = true;
          patchRequire(this.hybridFs);
          console.log('=====App====');
          require(this.requireFile);// in softFs
        }
      });
  }
}

module.exports = RunInMemoryPlugin;
