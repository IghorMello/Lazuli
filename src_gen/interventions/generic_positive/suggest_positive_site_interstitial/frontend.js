const $ = require('jquery')
require_component('interstitial-screen-positive-trigger')

const {
  append_to_body_shadow,
  once_body_available  
} = require('libs_frontend/frontend_libs')

const {
  get_goal_info
} = require('libs_common/intervention_info');

const {
  url_to_domain
} = require('libs_common/domain_utils')

var shadow_div;

var current_domain = url_to_domain(window.location.href)
var goal = get_goal_info()
var buttonText = `Click to continue to ${current_domain}`
var interst_screen = $('<interstitial-screen-positive-trigger>')
interst_screen.attr('positive_goal', goal)
interst_screen.attr('continue_button_text', buttonText)
once_body_available().then(function() {
  shadow_div = append_to_body_shadow(interst_screen);
})

window.on_intervention_disabled = () => {
  $(shadow_div).remove()
}

window.debugeval = x => eval(x);