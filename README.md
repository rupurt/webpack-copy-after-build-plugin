Webpack Copy After Build Plugin
===============================

A webpack plugin that allows webpack build artifacts to be included via sprockets
directives. This helps reduce the onboarding time and friction when introducing 
Webpack into a legacy Rails application.

Install
-------

```bash
npm install webpack-copy-after-build-plugin --save
```

Configuration
-------------

Create a directory in the asset pipeline which will receive copied build files e.g.

```
mkdir -p app/assets/javascripts/generated
```

Configure the plugin to copy the required bundles into the asset pipeline

```javascript
// client/webpack.config.js
var path = require("path");
var WebpackSprocketsRailsManifestPlugin = require("webpack-sprockets-rails-manifest-plugin");

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
    new WebpackSprocketsRailsManifestPlugin(),

    new WebpackCopyAfterBuildPlugin({
      "webpack-application-bundle":
      "../../app/assets/javascripts/generated/webpack-application-bundle.js",
    })
  ]
};
```

```javascript
// client/bundles/webpack-application.js
alert("Howdy, I'm a Webpack Javascript file that was required by a sprockets directive!");
```

Require the build artifact via a sprockets directive

```javascript
// app/assets/javascripts/application.js
//= require ./generated/webpack-application-bundle
```

Options and Defaults
---------------------

```javascript
{
  // The path that you give as the destination will be taken as absolute if this flag is set 
  absoluteMappingPaths : false
}
```