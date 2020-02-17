const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  plugins: [
    new BrowserSyncPlugin({
      host: "localhost",
      port: 3000,
      server: { baseDir: ["public"] },
      ghostMode: false,
      notify: false,
      watch: true,
      open: false // Won't automatically launch in default browser when started.
    })
  ],
  watch: true,
  devtool: "inline-source-map"
});
