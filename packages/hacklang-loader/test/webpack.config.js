const path = require("path");

/** @type import("@types/webpack").Configuration */
module.exports = {
  mode: "development",
  context: path.join(__dirname, "fixture"),
  entry: path.join(__dirname, "fixture/src"),
  output: {
    path: path.join(__dirname, "fixture/dist"),
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loader: require.resolve(path.join(__dirname, "..")),
        options: {},
      },
    ],
  },
};
