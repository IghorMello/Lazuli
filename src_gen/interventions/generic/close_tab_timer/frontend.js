const $ = require('jquery')

const {
  close_selected_tab
} = require('libs_common/tab_utils')

const {
  append_to_body_shadow,
  once_body_available
} = require('libs_frontend/frontend_libs')

require_component('lazuli-logo-v2')
require_component('time-until-tab-autoclose-view')

//Polymer button
require_component('paper-button')

var display_timespent_div = $('<time-until-tab-autoclose-view>');
var shadow_div;

once_body_available().then(function () {
  shadow_div = append_to_body_shadow(display_timespent_div);
})

window.on_intervention_disabled = () => {
  $(shadow_div).remove()
}
