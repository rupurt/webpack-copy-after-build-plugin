var fse = require("fs-extra");

function WebpackCopyAfterBuildPlugin(mappings, options) {
  this._mappings = mappings || {};
  this._options = options || {};
}

WebpackCopyAfterBuildPlugin.prototype.apply = function(compiler) {
  var mappings = this._mappings;
  var options  = this._options;

  compiler.plugin("done", function(stats) {
    var statsJson = stats.toJson();
    var chunks = statsJson.chunks;

    chunks.forEach(function(chunk) {
      var chunkName = chunk.names[0];
      var mapping = mappings[chunkName];

      if (mapping) {
        var devServer = compiler.options.devServer;
        var outputPath;

        if (devServer && devServer.contentBase) {
          outputPath = devServer.contentBase;
        } else {
          outputPath = compiler.options.output.path;
        }

        var chunkFilename = chunk.files[0];
        var from = outputPath + "/" + chunkFilename;
        var to;

        if( options.absoluteMappingPaths ){
          to = mapping;
        } else {
          to = outputPath + "/" + mapping;
        }

        fse.copySync(from, to);
      }
    });
  });
};

module.exports = WebpackCopyAfterBuildPlugin;
