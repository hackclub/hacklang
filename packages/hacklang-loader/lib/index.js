const loaderUtils = require("loader-utils");
const validateOptions = require("schema-utils");
const options = require("./options.json");
const hacklang = require("hacklang");

/**
 * @param {string} source
 * @this {import("webpack").loader.LoaderContext}
 */
module.exports = function loader(source) {
  /** @type {import("@types/webpack").Logger} */
  const logger = this.getLogger("hacklang-loader");
  const schema = loaderUtils.getOptions(this);

  validateOptions(schema, options, {
    name: "HackLang Loader",
    baseDataPath: "options",
  });

  /** @type {string | null} */
  let result = null;
  try {
    result = hacklang.compile(source);
    logger.info(`Compiled ${this.resourcePath}`);
  } catch (err) {
    return this.callback(err);
  }

  this.callback(null, result.code);
};
