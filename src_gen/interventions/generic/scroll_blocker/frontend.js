/* livescript */

var log_action, ref$, append_to_body_shadow, once_body_available, sleep, $, attr, nscrolls, NSCROLLS_THRESHOLD, keyIsDown, changeColorBack, enable_scrolling_and_hide_scroll_block, disable_scrolling_and_show_scroll_block, block_arrows, scroll_block_display, shadow_div;
set_default_parameters({
  scrollevents: 750
});
log_action = require('libs_frontend/intervention_log_utils').log_action;
ref$ = require('libs_frontend/frontend_libs'), append_to_body_shadow = ref$.append_to_body_shadow, once_body_available = ref$.once_body_available, sleep = ref$.sleep;
$ = require('jquery');
attr = require('jquery');
require_component('fb-scroll-block-display');
window.scrolling_allowed = true;
nscrolls = 0;
NSCROLLS_THRESHOLD = parameters.scrollevents;
keyIsDown = 0;
window.onwheel = function(evt){
  if (!window.intervention_disabled) {
    if (!window.scrolling_allowed) {
      scroll_block_display.attr('clr', 'rgb(255, 102, 102);');
    }
    nscrolls = nscrolls + 1;
    if (nscrolls % NSCROLLS_THRESHOLD === 0) {
      disable_scrolling_and_show_scroll_block();
    }
    return window.scrolling_allowed;
  }
};
changeColorBack = function(e){
  if (!window.scrolling_allowed) {
    return scroll_block_display.attr('clr', 'rgb(149, 203, 238);');
  }
};
window.setInterval(changeColorBack, 750);
enable_scrolling_and_hide_scroll_block = function(){
  window.scrolling_allowed = true;
  $("body").css('overflow', 'scroll');
  return scroll_block_display.hide();
};
disable_scrolling_and_show_scroll_block = function(){
  window.scrolling_allowed = false;
  $("body").css('overflow', 'hidden');
  scroll_block_display.show();
  return document.body.addEventListener('keydown', block_arrows);
};
block_arrows = function(e){
  var keyIsDown;
  if (e.keyCode === 38 || e.keyCode === 40) {
    scroll_block_display.attr('clr', 'rgb(255, 102, 102);');
    keyIsDown = 1;
    console.log('key blocked');
    return false;
  }
};
scroll_block_display = $('<fb-scroll-block-display clr="#95CBEE">');
shadow_div = null;
enable_scrolling_and_hide_scroll_block();
scroll_block_display[0].addEventListener('continue_scrolling', function(){
  log_action({
    'negative': 'Remained on Facebook.'
  });
  nscrolls = 0;
  return enable_scrolling_and_hide_scroll_block();
});
once_body_available(function(){
  disable_scrolling_and_show_scroll_block();
  return shadow_div = append_to_body_shadow(scroll_block_display);
});
window.on_intervention_disabled = function(){
  enable_scrolling_and_hide_scroll_block();
  return $(shadow_div).remove();
};