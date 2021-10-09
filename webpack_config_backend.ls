require! {
  livescript
  deepcopy
  webpack
}

webpack_config = deepcopy require './webpack.config.ls'

{get_alias_info} = require './alias_utils.ls'

for lib_info in get_alias_info()
  webpack_config.resolve.alias[lib_info.path] = lib_info.backend

webpack_config.devtool = false
#webpack_config.debug = false

module.exports = webpack_config
