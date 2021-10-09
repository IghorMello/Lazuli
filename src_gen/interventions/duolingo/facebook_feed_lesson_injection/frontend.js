/* livescript */

var inject_into_feed, ref$, wrap_in_shadow, on_url_change_not_from_history, append_to_body_shadow, $, duolingoLesson, duolingoLessonDiv, $currentInjectedDiv, repositionLesson, component_generator, injectPosition, spacing, stop_intervention;
window.feed_injection_active = true;
inject_into_feed = require('libs_frontend/facebook_utils').inject_into_feed;
ref$ = require('libs_frontend/frontend_libs'), wrap_in_shadow = ref$.wrap_in_shadow, on_url_change_not_from_history = ref$.on_url_change_not_from_history, append_to_body_shadow = ref$.append_to_body_shadow;
$ = require('jquery');
require('jquery.isinview')($);
require('jquery-inview')($);
require_component('duolingo-lesson-widget');
duolingoLesson = $('<duolingo-lesson-widget></duolingo-lesson-widget>');
duolingoLessonDiv = $(append_to_body_shadow(duolingoLesson, {
  zIndex: 0,
  position: 'absolute',
  width: '500px'
}));
$(duolingoLessonDiv[0].shadow_host).attr('id', 'duolingo_lesson_widget');
duolingoLesson.css('visibility', 'hidden');
duolingoLesson.css('width', '100%');
duolingoLesson[0].style.setProperty('--lesson-container-width', '500px');
$currentInjectedDiv = null;
repositionLesson = function(){
  var offset;
  if ($currentInjectedDiv != null) {
    offset = $currentInjectedDiv.offset();
    return duolingoLessonDiv.offset(offset);
  }
};
$(window).resize(function(){
  var resizeTimer;
  clearTimeout(resizeTimer);
  return resizeTimer = setTimeout(repositionLesson, 100);
});
component_generator = function(numitems){
  var feedItem, viewTriggerTop, viewTriggerBottom;
  feedItem = $('<div class="duolingo-lesson-container" style="height: 645px; width: 500px; position: relative;"></div>');
  feedItem.attr('items', window.itemsseen);
  viewTriggerTop = $('<div style="width: 1px; height: 1px">');
  feedItem.append(viewTriggerTop);
  viewTriggerTop.on('inview', function(event, isInView){
    var $placeholder, offset;
    $placeholder = $(this).parent();
    if (isInView && window.feed_injection_active) {
      offset = $placeholder.offset();
      duolingoLessonDiv.offset(offset);
      $currentInjectedDiv = $placeholder;
      return duolingoLesson.css('visibility', 'visible');
    }
  });
  viewTriggerBottom = $('<div style="width: 1px; height: 1px; position: absolute; top: 99%">');
  feedItem.append(viewTriggerBottom);
  viewTriggerBottom.on('inview', function(event, isInView){
    var $placeholder, offset;
    $placeholder = $(this).parent();
    if (isInView && window.feed_injection_active) {
      offset = $placeholder.offset();
      duolingoLessonDiv.offset(offset);
      $currentInjectedDiv = $placeholder;
      return duolingoLesson.css('visibility', 'visible');
    }
  });
  return feedItem;
};
injectPosition = 0;
spacing = 8;
inject_into_feed(component_generator, injectPosition, spacing);
on_url_change_not_from_history(function(){
  return stop_intervention();
});
window.on_intervention_disabled = function(){
  return stop_intervention();
};
stop_intervention = function(){
  $('#duolingo_lesson_widget').remove();
  window.feed_injection_active = false;
  return clearInterval(window.firststartprocess);
};
window.debugeval = function(it){
  return eval(it);
};