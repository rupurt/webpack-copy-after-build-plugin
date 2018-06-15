Webpack Copy On Plugin
===============================

A webpack plugin that allows webpack build artifacts to be copied into custom paths. 
For example to be included via sprockets
directives. The idea is to simplify your build setups or development workflow when using builds from IDEs as IntelliJ which may use different
output directories. For example in connection with SpringBoot builds.

Based on the webpack-copy-after-build-plugin, thanks to https://github.com/rupurt 

Install
-------

```bash
npm install webpack-copy-on-plugin --save
```

Configuration
-------------

Configure the plugin to copy the required bundles
This example will copy the webpack-application-bundle.js from the webpack output folder to the given relative path (../../copy/to/this/path/webpack-application-bundle.js)

Parameters:<br />
Webpack compiler eventHook name, see https://webpack.js.org/api/compiler-hooks/<br />
webpack build copy definitions as { entrypoint-name: path or [paths]}<br />
options<br />
copy folders definition as [ [src, dest], [src, dest], ... ]<br />

```javascript
// client/webpack.config.js
var path = require("path");

var config = {
  context: __dirname,

  entry: {
    "webpack-application-bundle": "./bundles/webpack-application"
  },

  output: {
    path: path.resolve(__dirname, "../public/assets"),
    filename: "[name]-[chunkhash].js"
  },

  // Other config ...

  plugins: [
    new WebpackCopyOnPlugin('done', {
      "webpack-application-bundle":
      "../../copy/to/this/path/webpack-application-bundle.js",
    }, {
        // options
    }, [
        // folders to copy
        // [from, to], [from, to], ...
    ]
    )
  ]
};
```


Options and Defaults
---------------------

```javascript
{
  // The path that you give as the destination will be taken as absolute if this flag is set 
  absoluteMappingPaths : false,
  // A path that will be resolved with
  dirname : __dirname
}
```

Copying Folders
---------------------

```javascript
[
  // Array of arrays of src and dest folders. 
  // Either as relative paths to be resolved with the dirname option, or as absolute paths
  ['./src/file1', './dest/file1'],
  ['./src/file2', './dest/file2']
  
]
```