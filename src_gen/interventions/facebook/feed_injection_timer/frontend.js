/* livescript */

var inject_into_feed, wrap_in_shadow, $, component_generator;
inject_into_feed = require('libs_frontend/facebook_utils').inject_into_feed;
wrap_in_shadow = require('libs_frontend/frontend_libs').wrap_in_shadow;
$ = require('jquery');
require_component('feed-item-timer-polymer');
component_generator = function(numitems){
  var feedItem;
  feedItem = $('<feed-item-timer-polymer>');
  feedItem.attr('items', window.itemsseen);
  return wrap_in_shadow(feedItem);
};
inject_into_feed(component_generator);
window.on_intervention_disabled = function(){
  $('feed-item-timer-polymer').remove();
  window.feed_injection_active = false;
  return clearInterval(window.firststartprocess);
};