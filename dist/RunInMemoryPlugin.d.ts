export = RunInMemoryPlugin;
declare class RunInMemoryPlugin {
    /**
     * @typedef {{requireFile:string|false}} RunInMemoryPluginOptions
     * @param {RunInMemoryPluginOptions} options
     */
    constructor(options: {
        requireFile: string | false;
    });
    /**
     * a path to a js file to be required after complition
     */
    requireFile: string | false;
    /**
     *
     * @param {webpack.Compiler} compiler
     */
    apply(compiler: webpack.Compiler): void;
    #private;
}
import webpack = require("webpack");
//# sourceMappingURL=RunInMemoryPlugin.d.ts.map