const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const webpackConfig = require("./webpack.config");

test("webpack works", (/** @type {object} */ cb) => {
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    handleError(err, stats, cb);

    const output = fs.readFileSync(path.join(__dirname, "fixture/dist/main.js"));
    expect(output).not.toMatch(/throw new Error/);
    expect(output).toMatch(/luke variable gleich/);

    cb();
  });
});

/**
 * @param {Error} err
 * @param {webpack.Stats} stats
 * @param {object} cb
 */
function handleError(err, stats, cb) {
  if (err) {
    console.error(err);
    if (err.details) {
      console.error(err.details);
    }
    cb.fail(new Error(err || err.details));
  }

  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.error(info.errors);
    cb.fail(new Error(info.errors));
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
}
