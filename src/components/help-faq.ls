{polymer_ext} = require 'libs_frontend/polymer_utils'
screenshot_utils = require 'libs_common/screenshot_utils'

polymer_ext {
  is: 'help-faq'
  properties: {
    mailing_list: {
      type: String
      value: [['lazuli', 'support'].join('-'), ['cs', 'stanford', 'edu'].join('.')].join('@')
    }
  }

  change_tab: (evt) ->
    evt.preventDefault()
    evt.stopPropagation()
    newtab = evt.target.getAttribute('newtab')
    this.fire 'need_tab_change', {newtab: newtab}
  
  get_icon: ->
    return chrome.extension.getURL('icons/icon_19.png')
  
  submit_feedback_clicked: ->>
    #screenshot_utils = await SystemJS.import('libs_common/screenshot_utils')
    screenshot = await screenshot_utils.get_screenshot_as_base64()
    data = await screenshot_utils.get_data_for_feedback()
    feedback_form = document.createElement('feedback-form')
    document.body.appendChild(feedback_form)
    feedback_form.screenshot = screenshot
    feedback_form.other = data
    feedback_form.open()
}