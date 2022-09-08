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

  #restartOnErrors = true ;
  /**
   * @typedef {{requireFile?:string|false,restartOnErrors?:boolean}} RunInMemoryPluginOptions 
   * @param {RunInMemoryPluginOptions} options 
   */
  constructor(options) {
    /**
     * a path to a js file to be required after complition
     */
    this.requireFile = options?.requireFile;
    if (options.restartOnErrors !== undefined){
      this.#restartOnErrors = options.restartOnErrors ;
    }
  }

  
  #isRunning = false;

  #softFs = createFsFromVolume(new Volume());

  #hybridFs = hybridFs
    .use(solidFs)
    .use(this.#softFs);


  /**
   * 
   * @param {webpack.Compiler} compiler 
   */
  apply(compiler) {
    compiler.hooks.run.tap(
      pluginName, (compilation) => {
        // eslint-disable-next-line no-param-reassign
        compilation.outputFileSystem = this.#softFs;
      });

    compiler.hooks.watchRun.tap(
      pluginName, (compilation) => {
        // eslint-disable-next-line no-param-reassign
        compilation.outputFileSystem = this.#softFs;
      });
    // TODO can it run with tap ?
    compiler.hooks.afterEmit.tapAsync(
      pluginName,
      (compilation, next) => {
        if (!this.requireFile & this.requireFile !== false) {
          const assets = compilation.getAssets();
          this.requireFile = join(compiler.outputPath, assets[0].name);
          console.log(`did't provide a requireFile. using first asset of : ${assets}`);
        }
        next();
      },
    );

    compiler.hooks.afterDone.tap(
      pluginName, (stats) => {
        // TODO run when there is no error 
        // TODO Rerun

        if (stats.hasErrors() && this.#restartOnErrors){
          this.#isRunning = false;
        }

        if (!stats.hasErrors() && !this.#isRunning && this.requireFile !== false) {
          this.#isRunning = true;
          patchRequire(this.#hybridFs);
          setTimeout(() => {
            console.log('=====App====');
            globalThis.$module = {
              /**
               * call in HMR when module fails to restart 
               *    on next successful compilation.
               * @returns 
               */
              failed: () => {
                this.#isRunning = false;
                console.log('app signaled a failure !')
                return true;
              },
            };
            // refresh cache
            delete require.cache[this.requireFile];
            require(this.requireFile);// in softFs
          });
        }
      });
  }
}

module.exports = RunInMemoryPlugin;
