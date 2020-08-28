const loaderUtils = require("loader-utils");
const validateOptions = require("schema-utils");
const options = require("./options.json");

/**
 * @param {string} source
 */
module.exports = function loader(source) {
  const schema = loaderUtils.getOptions(this);

  validateOptions(schema, options, {
    name: "HackLang Loader",
    baseDataPath: "options",
  });
};
