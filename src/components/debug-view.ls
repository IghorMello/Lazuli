{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

window.list_polymer_ext_tags_with_info = list_polymer_ext_tags_with_info

polymer_ext {
  is: 'debug-view'
  tag_link_url: (tagname) ->
    "index.html?tag=#{tagname}"

  tags_with_info: ->
    list_polymer_ext_tags_with_info()
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'json_stringify'
  ]
}