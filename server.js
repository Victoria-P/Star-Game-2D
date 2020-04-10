const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

const compiler = webpack(webpackConfig);
const watching = compiler.watch(webpackConfig.watchOptions, (err, stats) => {});

var express = require("express");
var app = express();
var http = require("http").Server(app);
app.set("port", process.env.PORT || 4000);
app.use("/", express.static(__dirname));

http.listen(app.get("port"), function() {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});