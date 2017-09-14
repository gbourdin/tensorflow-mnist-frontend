const express = require('express');
const webpack = require('webpack');
const http = require('http');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
app.use(require('morgan')('short'));

const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, 
    publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler, {
  log: console.log, 
  path: '/__webpack_hmr', 
  heartbeat: 10 * 1000
}));

let server = http.createServer(app);
server.listen(process.env.PORT || 4444, function() {
  console.log("Listening on %j", server.address());
});
