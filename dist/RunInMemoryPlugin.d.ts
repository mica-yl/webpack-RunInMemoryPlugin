export = RunInMemoryPlugin;
declare class RunInMemoryPlugin {
    /**
     * @typedef {{requireFile:string}} RunInMemoryPluginOptions
     * @param {RunInMemoryPluginOptions} options
     */
    constructor(options: {
        requireFile: string;
    });
    isRunning: boolean;
    /**
     * a path to a js file to be required after complition
     */
    requireFile: string;
    softFs: import("memfs").IFs;
    hybridFs: import("unionfs").IUnionFs;
    /**
     *
     * @param {webpack.Compiler} compiler
     */
    apply(compiler: webpack.Compiler): void;
}
import webpack = require("webpack");
//# sourceMappingURL=RunInMemoryPlugin.d.ts.map