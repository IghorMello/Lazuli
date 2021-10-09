/* livescript */

(function(it){
  return it();
})(function(){
  var dlog, add_url_input_if_needed, ref$, log_pageview, log_pagenav, hash, hash_colon_index, hashdata_unparsed, add_options_view, onboarding_view, options_view;
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
  add_url_input_if_needed = function(){
    var url_input;
    if (localStorage.index_show_url_bar === 'true') {
      url_input = document.createElement('input');
      url_input.style.position = 'fixed';
      url_input.style.bottom = '0px';
      url_input.style.left = '0px';
      url_input.value = window.location.href;
      url_input.style.width = '100vw';
      url_input.style.backgroundColor = 'transparent';
      url_input.style.border = 'none';
      url_input.style.color = 'white';
      url_input.style.backgroundColor = 'black';
      url_input.addEventListener('keydown', function(evt){
        if (evt.keyCode === 13) {
          if (url_input.value !== window.location.href) {
            return window.location.href = url_input.value;
          } else {
            return window.location.reload();
          }
        }
      });
      document.body.appendChild(url_input);
    }
  };
  window.developer_options = function(){
    return window.location.href = '/index.html?tag=options-dev';
  };
  ref$ = require('libs_backend/log_utils'), log_pageview = ref$.log_pageview, log_pagenav = ref$.log_pagenav;
  if (window.location.pathname === '/options.html') {
    require('components/options-view-v2.deps');
    hash = window.location.hash;
    if (hash == null || hash === '') {
      hash = '#settings';
      window.location.hash = '#settings';
    }
    if (hash.startsWith('#')) {
      hash = hash.substr(1);
    }
    hash_colon_index = hash.indexOf(':');
    if (hash_colon_index !== -1) {
      hashdata_unparsed = window.hashdata_unparsed = hash.substr(hash_colon_index + 1);
      hash = window.location.hash = hash.substr(0, hash_colon_index);
    }
    add_options_view = function(is_hidden){
      var options_view;
      options_view = document.querySelector('#options_view');
      if (options_view != null) {
        return options_view;
      }
      options_view = document.createElement('options-view-v2');
      options_view.have_options_page_hash = true;
      options_view.setAttribute('id', 'options_view');
      if (is_hidden) {
        options_view.style.display = 'none';
      }
      options_view.set_selected_tab_by_name(hash);
      options_view.addEventListener('options_selected_tab_changed', function(evt){
        var selected_tab_name, hash;
        selected_tab_name = evt.detail.selected_tab_name;
        hash = window.location.hash;
        if (hash.startsWith('#')) {
          hash = hash.substr(1);
        }
        if (selected_tab_name === 'settings' && hash === 'onboarding') {
          return;
        }
        return window.location.hash = selected_tab_name;
      });
      document.getElementById('index_body').appendChild(options_view);
      return options_view;
    };
    if (hash === 'onboarding') {
      require('components/onboarding-view.deps');
      onboarding_view = document.createElement('onboarding-view');
      onboarding_view.addEventListener('onboarding-complete', function(evt){
        var options_view;
        onboarding_view.style.display = 'none';
        onboarding_view.parentNode.removeChild(onboarding_view);
        options_view = add_options_view(false);
        options_view.style.display = 'block';
        options_view.rerender().then(function(){
          return options_view.onboarding_completed();
        });
        window.location.hash = 'settings';
        return log_pagenav({
          from: 'onboarding',
          to: 'settings',
          reason: 'onboarding-complete'
        });
      });
      document.getElementById('index_body').appendChild(onboarding_view);
      log_pageview({
        to: 'onboarding'
      });
    } else {
      options_view = add_options_view(false);
      log_pageview();
    }
    require('libs_common/global_exports_post');
    add_url_input_if_needed();
  }
});