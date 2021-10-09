{get_screenshot_as_base64} = require 'libs_common/screenshot_utils'

$ = require 'jquery'

export add_screenshot_overlay = ->>
  base64_data = await get_screenshot_as_base64()
  overlay_img = $('<img>').attr('src', base64_data).attr('id', 'screenshot_overlay')
  overlay_img.css {
    position: 'fixed'
    width: document.documentElement.clientWidth + 'px'
    height: document.documentElement.clientHeight + 'px'
    #width: '100vw'
    #height: '100vh'
    top: '0px'
    left: '0px'
    'z-index': 2147483646
  }
  overlay_img.appendTo($('body'))

export remove_screenshot_overlay = ->
  $('#screenshot_overlay').remove()
