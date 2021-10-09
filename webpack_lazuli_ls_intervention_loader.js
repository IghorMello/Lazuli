const loader_utils = require('loader-utils')
const livescript = require('livescript-async')
const { preprocess_javascript } = require('./webpack_lazuli_intervention_loader_utils')

module.exports = function (source) {
  let result = livescript.compile(source, { bare: true, header: false })
  return "/* lazuli livescript intervention loader */\n\n" + preprocess_javascript(result)
}
