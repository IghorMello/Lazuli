/* livescript */

(function(it){
  return it();
})(function(){
  var dlog;
  window.global_exports = {};
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
  return async function(){
    var add_url_input_if_needed, getUrlParameters, use_polyfill, jsYaml, get_interventions, set_nested_property, start_page_index;
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
    getUrlParameters = (await SystemJS['import']('libs_frontend/frontend_libs')).getUrlParameters;
    use_polyfill = getUrlParameters().polyfill;
    if (use_polyfill && use_polyfill !== 'false' && parseInt(use_polyfill) !== 0) {
      document.registerElement = null;
      (await SystemJS['import']('webcomponentsjs-custom-element-v0'));
    }
    window.Polymer = {
      dom: 'shady',
      lazyRegister: true
    };
    jsYaml = (await SystemJS['import']('js-yaml'));
    get_interventions = (await SystemJS['import']('libs_backend/intervention_utils')).get_interventions;
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
    start_page_index = async function(){
      var interventions, params, tagname, index_body_width, index_body_height, tag, num_properties, k, v, index_body;
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
      params = getUrlParameters();
      tagname = params.tag;
      index_body_width = params.index_body_width, index_body_height = params.index_body_height;
      if (tagname == null) {
        tagname = 'debug-view';
      }
      (await SystemJS['import']('components/' + tagname + '.deps'));
      tag = document.createElement(tagname);
      num_properties = 0;
      for (k in params) {
        v = params[k];
        if (k === 'tag' || k === 'index_body_width' || k === 'index_body_height') {
          continue;
        }
        v = jsYaml.safeLoad(v);
        set_nested_property(tag, k, v);
        num_properties += 1;
      }
      if (num_properties === 0) {
        tag.isdemo = true;
      }
      document.getElementById('index_contents').appendChild(tag);
      index_body = document.getElementById('index_body');
      if (index_body_width != null) {
        index_body.style.width = index_body_width;
      }
      if (index_body_height) {
        index_body.style.height = index_body_height;
      }
      add_url_input_if_needed();
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
    (await SystemJS['import']('libs_common/global_exports_post'));
  }();
});