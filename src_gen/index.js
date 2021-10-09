/* livescript */

(function(it){
  return it();
})(function(){
  var dlog, add_url_input_if_needed, hash, options_view, getUrlParameters, set_intervention, params, use_polyfill, use_shadow_dom, jsYaml, get_interventions, get_custom_component_info, wrap_in_shadow, set_nested_property, log_pageview, start_page_index;
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
  if (window.location.pathname === '/popup.html') {
    require('components/popup-view.deps');
    document.querySelector('#index_body').appendChild(document.createElement('popup-view'));
    require('libs_common/global_exports_post');
    return;
  }
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
    options_view = document.querySelector('#options_view');
    if (hash === 'introduction') {
      options_view.selected_tab_idx = -1;
    }
    options_view.set_selected_tab_by_name(hash);
    options_view.addEventListener('options_selected_tab_changed', function(evt){
      return window.location.hash = evt.detail.selected_tab_name;
    });
    require('libs_common/global_exports_post');
    add_url_input_if_needed();
    return;
  }
  getUrlParameters = require('libs_frontend/frontend_libs').getUrlParameters;
  set_intervention = require('libs_common/intervention_info').set_intervention;
  params = getUrlParameters();
  use_polyfill = false;
  if (params.polyfill != null) {
    use_polyfill = params.polyfill;
    delete params.polyfill;
    if (use_polyfill && use_polyfill !== 'false' && parseInt(use_polyfill) !== 0) {
      document.registerElement = null;
      require('webcomponentsjs-custom-element-v0');
    }
  }
  window.Polymer = window.Polymer || {};
  window.Polymer.lazyRegister = true;
  window.Polymer.dom = 'shady';
  use_shadow_dom = false;
  if (params.shadow_dom != null) {
    use_shadow_dom = params.use_shadow_dom;
    if (use_shadow_dom && use_shadow_dom !== 'false' && parseInt(use_shadow_dom) !== 0) {
      window.Polymer.dom = 'shadow';
    }
  }
  jsYaml = require('js-yaml');
  get_interventions = require('libs_backend/intervention_utils').get_interventions;
  get_custom_component_info = require('libs_backend/component_utils').get_custom_component_info;
  wrap_in_shadow = require('libs_frontend/frontend_libs').wrap_in_shadow;
  /*
  export getUrlParameters = ->
    url = window.location.href
    hash = url.lastIndexOf('#')
    if hash != -1
      url = url.slice(0, hash)
    map = {}
    parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) ->
      #map[key] = decodeURI(value).split('+').join(' ').split('%2C').join(',') # for whatever reason this seems necessary?
      map[key] = decodeURIComponent(value).split('+').join(' ') # for whatever reason this seems necessary?
    )
    return map
  */
  set_nested_property = function(tag, property_name, property_value){
    var dot_index, property_name_start, property_name_remainder;
    dot_index = property_name.indexOf('.');
    if (dot_index === -1) {
      tag[property_name] = property_value;
      return;
    }
    property_name_start = property_name.substr(0, dot_index);
    property_name_remainder = property_name.substr(dot_index + 1);
    return set_nested_property(tag[property_name_start], property_name_remainder, property_value);
  };
  log_pageview = require('libs_backend/log_utils').log_pageview;
  start_page_index = async function(){
    var interventions, tagname, index_body_width, index_body_height, index_background_color, component_info, systemjs_config_extra_map, tag, num_properties, k, ref$, v, index_body;
    document.title = window.location.href.replace(chrome.extension.getURL(''), '').replace('index.html?tag=', '');
    interventions = (await get_interventions());
    window.intervention = interventions['debug/fake_intervention'];
    window.goal_info = {
      name: 'debug/fake_goal',
      domain: 'lazuli.stanford.edu',
      homepage: 'https://lazuli.stanford.edu',
      sitename: 'goal',
      sitename_printable: 'Goal',
      description: 'Fake goal'
    };
    require('components/components.deps');
    tagname = params.tag;
    index_body_width = params.index_body_width, index_body_height = params.index_body_height, index_background_color = params.index_background_color;
    if (tagname == null) {
      tagname = 'debug-view';
    }
    component_info = (await get_custom_component_info(tagname));
    if (component_info != null) {
      systemjs_config_extra_map = localStorage.getItem('systemjs_config_extra_map');
      if (systemjs_config_extra_map != null) {
        systemjs_config_extra_map = JSON.parse(systemjs_config_extra_map);
        SystemJS.config({
          map: systemjs_config_extra_map
        });
      }
      (await SystemJS['import']('components/' + component_info.name + '.deps'));
    }
    tag = document.createElement(tagname);
    num_properties = 0;
    for (k in ref$ = params) {
      v = ref$[k];
      if (k === 'tag' || k === 'index_body_width' || k === 'index_body_height' || k === 'index_background_color') {
        continue;
      }
      v = jsYaml.safeLoad(v);
      set_nested_property(tag, k, v);
      num_properties += 1;
    }
    if (num_properties === 0) {
      tag.isdemo = true;
    }
    if (use_shadow_dom) {
      document.getElementById('index_contents').appendChild(wrap_in_shadow(tag));
    } else {
      document.getElementById('index_contents').appendChild(tag);
    }
    index_body = document.getElementById('index_body');
    if (index_body_width != null) {
      index_body.style.width = index_body_width;
    }
    if (index_body_height) {
      index_body.style.height = index_body_height;
    }
    if (index_background_color == null) {
      if (['options-view-v2', 'options-view', 'popup-view-v2', 'popup-view'].indexOf(tagname) === -1) {
        if (tag.index_background_color != null) {
          index_background_color = tag.index_background_color;
        } else {
          index_background_color = 'white';
        }
      } else {
        index_background_color = 'rgb(81, 167,249)';
      }
    }
    if (index_background_color != null) {
      console.log('setting index background color to ' + index_background_color);
      document.body.style.backgroundColor = index_background_color;
    }
    add_url_input_if_needed();
    window.basetag = tag;
    log_pageview({
      to: 'index'
    });
  };
  start_page_index();
  window.uselib = function(libname, callback){
    if (typeof callback === 'function') {
      return SystemJS['import'](libname).then(callback);
    } else if (typeof callback === 'string') {
      return SystemJS['import'](libname).then(function(imported_lib){
        window[callback] = imported_lib;
        return console.log('imported as window.' + callback);
      });
    } else if (typeof libname === 'string') {
      callback = libname.toLowerCase().split('').filter(function(x){
        return 'abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(x) !== -1;
      }).join('');
      return SystemJS['import'](libname).then(function(imported_lib){
        window[callback] = imported_lib;
        return console.log('imported as window.' + callback);
      });
    } else {
      return console.log(['Use uselib() to import jspm libraries.', 'The first argument is the library name (under SystemJS, see jspm)', 'The second argument is the name it should be given (in the \'window\' object)', 'Example of using moment:', '    uselib(\'moment\', \'moment\')', '    window.moment().format()', 'Example of using jquery:', '    uselib(\'jquery\', \'$\')', '    window.$(\'body\').css(\'background-color\', \'black\')', 'Example of using sweetalert2:', '    uselib(\'libs_common/content_script_utils\', \'content_script_utils\')', '    content_script_utils.load_css_file(\'bower_components/sweetalert2/dist/sweetalert2.css\')', '    uselib(\'sweetalert2\', \'swal\')', '    swal(\'hello world\')'].join('\n'));
    }
  };
  if (localStorage.refresh_livereload === 'true') {
    (async function(){
      var script_fetch_result, script_text, script_tag, e;
      try {
        script_fetch_result = (await fetch('http://localhost:35729/livereload.js?snipver=1'));
        script_text = (await script_fetch_result.text());
        script_tag = document.createElement('script');
        script_tag.src = 'http://localhost:35729/livereload.js?snipver=1';
        document.getElementsByTagName('head')[0].appendChild(script_tag);
        eval(script_text);
      } catch (e$) {
        e = e$;
        console.log(e);
      }
    })();
  }
  return require('libs_common/global_exports_post');
});