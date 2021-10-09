/* livescript */

var inject_into_feed, wrap_in_shadow, $, component_generator;
inject_into_feed = require('libs_frontend/facebook_utils').inject_into_feed;
wrap_in_shadow = require('libs_frontend/frontend_libs').wrap_in_shadow;
$ = require('jquery');
require_component('positive-site-trigger-v2');
component_generator = function(numitems){
  var feedItem;
  feedItem = $('<positive-site-trigger-v2>');
  feedItem.attr('in_facebook_news_feed', true);
  return wrap_in_shadow(feedItem);
};
inject_into_feed(component_generator, 0, 8);
window.on_intervention_disabled = function(){
  $('positive-site-trigger-v2').remove();
  window.feed_injection_active = false;
  return clearInterval(window.firststartprocess);
};
window.debugeval = function(it){
  return eval(it);
};