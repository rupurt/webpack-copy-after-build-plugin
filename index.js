const fse = require("fs-extra");
const path = require('path');

function WebpackCopyAfterBuildPlugin(eventHook, mappings, options, folders) {
    this._mappings = mappings || {};
    this._options = options || {};
    this._folders = folders || [];
    this._eventHook = eventHook || '';
}

WebpackCopyAfterBuildPlugin.prototype.apply = function(compiler) {
    const mappings = this._mappings;
    const options  = this._options;
    const folders = this._folders;
    const eventHook = this._eventHook;

    const mapTo = (mapping, outputPath) => {
        let to;
        if ( options.absoluteMappingPaths ){
            to = mapping;
        } else if (options.dirname) {
            to = path.resolve(options.dirname, mapping);
        } else {
            to = outputPath + "/" + mapping;
        }
        return to;
    };

    const copyFolder = (from, to) => {
        let fromPath;
        let toPath;

        if (options.dirname) {
            fromPath = path.resolve(options.dirname, from);
            toPath = path.resolve(options.dirname, to);
        } else {
            fromPath = from;
            toPath = to;
        }
        fse.copySync(fromPath, toPath);
    }

    compiler.plugin(eventHook, function(stats) {
        const statsJson = stats.toJson();
        const chunks = statsJson.chunks;
        chunks.forEach(function(chunk) {
            const chunkName = chunk.names[0];
            let mapping = mappings[chunkName];
            if (mapping) {
                const devServer = compiler.options.devServer;
                let outputPath;

                if (devServer && devServer.contentBase) {
                    outputPath = devServer.contentBase;
                } else {
                    outputPath = compiler.options.output.path;
                }

                let chunkFilename = chunk.files[0];
                const from = outputPath + "/" + chunkFilename;
                let to;

                if(!Array.isArray(mapping)){
                    mapping = [mapping]
                }
                mapping.forEach( (mapEntry) => {
                    to = mapTo(mapEntry, outputPath);
                    fse.copySync(from, to);
                });
            }
        });
        folders.forEach( (fromTo) => {
            copyFolder(fromTo[0], fromTo[1])
        });
    });
};

module.exports = WebpackCopyAfterBuildPlugin;
