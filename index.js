var fse = require("fs-extra");

function WebpackCopyAfterBuildPlugin(mappings) {
  this._mappings = mappings || {};
}

WebpackCopyAfterBuildPlugin.prototype.apply = function(compiler) {
  var mappings = this._mappings;

  compiler.plugin("done", function(stats) {
    var statsJson = stats.toJson();
    var chunks = statsJson.chunks;

    chunks.forEach(function(chunk) {
      var bundleName = chunk.names[0];
      var mapping = mappings[bundleName];

      if (mapping) {
        var outputPath = compiler.options.output.path;
        var webpackContext = compiler.options.context;
        var chunkHashFileName = chunk.files[0];
        var from = webpackContext + "/" + outputPath + "/" + chunkHashFileName;
        var to = webpackContext + "/" + outputPath + "/" + mapping;

        fse.copySync(from, to);
      }
    });
  });
};

module.exports = WebpackCopyAfterBuildPlugin;
