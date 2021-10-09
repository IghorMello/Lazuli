/* livescript */

(function(it){
  return it();
})(function(){
  var dlog, log_pageview;
  window.global_exports = {};
  require('enable-webcomponents-in-content-scripts');
  window.addEventListener("unhandledrejection", function(evt){
    throw evt.reason;
  });
  dlog = window.dlog = function(){
    var args, res$, i$, to$;
    res$ = [];
    for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    args = res$;
    if (localStorage.getItem('display_dlog') === 'true') {
      return console.log.apply(console, args);
    }
  };
  require('libs_backend/systemjs');
  log_pageview = require('libs_backend/log_utils').log_pageview;
  if (window.location.pathname === '/popup.html') {
    require('components/popup-view.deps');
    require('libs_common/global_exports_post');
    log_pageview({
      to: 'popup'
    });
  }
});