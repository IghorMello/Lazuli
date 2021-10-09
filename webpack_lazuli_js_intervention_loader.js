const loader_utils = require('loader-utils')
const { preprocess_javascript } = require('./webpack_lazuli_intervention_loader_utils')

module.exports = function (source) {
  //console.log(loader_utils.getRemainingRequest(this))
  //console.log(loader_utils.getCurrentRequest(this))
  return "/* lazuli javascript intervention loader */\n\n" + preprocess_javascript(source)
}
