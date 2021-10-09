const list_requires = require('list_requires_multi')
const fs = require('fs')

function get_components_to_require_statements(components) {
  let output = {}
  for (let component of components) {
    let component_path = `bower_components/${component}/${component}.deps.js`
    if (fs.existsSync('src/' + component_path)) {
      output[component] = component_path
      continue
    }
    component_path = `components/${component}.deps.js`
    output[component] = component_path
    //if (fs.existsSync('src/' + component_path)) {
    //  output[component] = component_path
    //  continue
    //}
    //component_path = `components/#{component}.deps.js`
  }
  return output
}

function replace_function_call(source, orig_function_name, orig_function_param, new_function_name, new_function_param) {
  let output = source
  let to_be_replaced_list = [orig_function_name + '("' + orig_function_param + '")', orig_function_name + '(\'' + orig_function_param + '\')', orig_function_name + '(`' + orig_function_param + '`)']
  let successfully_replaced = false
  for (let to_be_replaced of to_be_replaced_list) {
    if (output.includes(to_be_replaced)) {
      successfully_replaced = true
      output = output.split(to_be_replaced).join(new_function_name + '("' + new_function_param + '")')
    }
  }
  return { newtext: output, replaced: successfully_replaced }
}

function preprocess_javascript(source) {
  let code_with_async_wrapper = `
  (async function() {
    ${source}
  })();
  `
  let prefix_lines = []
  let suffix_lines = []
  suffix_lines.push('window.debugeval = x => eval(x);')
  suffix_lines.push('require("libs_frontend/intervention_first_impression_utils").show_first_impression_notice_if_needed();')
  prefix_lines.push('window.Polymer = window.Polymer || {};')
  prefix_lines.push('window.Polymer.dom = "shadow";')
  prefix_lines.push(`
  if (typeof(window.wrap) != 'function') {
    window.wrap = null;
  }
  `)
  prefix_lines.push('require("enable-webcomponents-in-content-scripts");')
  prefix_lines.push('async function lazuli_intervention_main_function(){')
  suffix_lines.push(`
	  }

	(async function() {

		let {get_is_suggestion_mode, get_is_suggestion_mode_optout, get_is_new_session} = require('libs_common/intervention_info')

		if (get_is_suggestion_mode()) {
      if (get_is_suggestion_mode_optout()) {
        // opt out suggestions todo
        if (get_is_new_session()) {
          require('components/lazuli-intervention-suggestion-thisvisit-optout.deps');
          
          let {
            append_to_body_shadow,
            once_body_available
          } = require('libs_frontend/frontend_libs');
          
          await once_body_available();
          let intervention_suggestion_display = document.createElement('lazuli-intervention-suggestion-thisvisit-optout');
          let shadow_intervention_suggestion_display = append_to_body_shadow(intervention_suggestion_display, {zIndex: 9007199254740991});
          setTimeout(function() {
            intervention_suggestion_display.show();
          }, 5000)

          lazuli_intervention_main_function();
        } else {
          
        }
      } else {
        // opt in suggestions
        if (get_is_new_session()) {
          require('components/lazuli-intervention-suggestion-thisvisit.deps');
          
          let {
            append_to_body_shadow,
            once_body_available
          } = require('libs_frontend/frontend_libs');
          
          await once_body_available();
          let intervention_suggestion_display = document.createElement('lazuli-intervention-suggestion-thisvisit');
          let shadow_intervention_suggestion_display = append_to_body_shadow(intervention_suggestion_display);
          intervention_suggestion_display.show();
          
          intervention_suggestion_display.addEventListener('intervention_suggestion_accepted', function() {
            lazuli_intervention_main_function();
          });
        } else {
          
        }
      }
		} else {
		  lazuli_intervention_main_function();
		}

	})();
  `)
  let all_requires = list_requires(source, ['require', 'require_component', 'require_css', 'require_style', 'require_package', 'require_remote', 'define_component'])


  // Wrap the intervention in require.ensure for all require and require_component
  console.log('=====================')
  console.log(source)
  console.log('=====================')
  let required_components = []
  required_components = required_components.concat(all_requires.require_component)
  // if (required_components == null) {
  //   required_components = []
  // }
  console.log(all_requires.require_component)
  console.log(required_components)
  let required = []
  required = required.concat(all_requires.require)
  console.log(required)
  let requires_for_required_components_object = get_components_to_require_statements(required_components)
  let requires_for_required_components = Object.values(requires_for_required_components_object)
  console.log(get_components_to_require_statements(required_components))
  console.log(requires_for_required_components)
  required = required.concat(requires_for_required_components)
  let dependency_string = required.join('\',\'')
  let match_ensure_string = ''
  if (dependency_string != '') {
    let ensure_string = 'require.ensure([\'' + dependency_string + '\'], async function(require) { \n'
    prefix_lines.push(ensure_string)
    match_ensure_string = '}) \n'
    console.log(ensure_string)
  }


  if (all_requires.define_component) {
    prefix_lines.push("var define_component = require('libs_frontend/polymer_utils').polymer_ext;")
  }
  function is_component_require(x) {
    if (x.endsWith('.deps') || x.endsWith('.deps.js')) {
      return true
    }
    if (x == 'libs_frontend/toast_utils') {
      return true
    }
    return false
  }
  function is_nonempty(list) {
    return (list != null && list.length > 0)
  }
  function has_matching_elems(list, func) {
    return (list != null && list.filter(func).length > 0)
  }
  function has_elem(list, elem) {
    return (list != null && list.includes(elem))
  }
  //if (has_matching_elems(all_requires.require, is_component_require) || is_nonempty(all_requires.define_component) || is_nonempty(all_requires.require_component)) {
  //  if (!has_elem(all_requires.require, 'enable-webcomponents-in-content-scripts')) {
  //    prefix_lines.push('require("enable-webcomponents-in-content-scripts");')
  //  }
  //}
  if (is_nonempty(all_requires.require_component)) {
    let component_list = all_requires.require_component
    let requires_for_components = get_components_to_require_statements(component_list)
    for (let component_name of component_list) {
      let component_path = requires_for_components[component_name]
      if (component_path == null) {
        console.error('component for require_component not found: ' + component_name)
        continue
      }
      let { newtext, replaced } = replace_function_call(source, 'require_component', component_name, 'require', component_path)
      if (!replaced) {
        console.error('incorrect format of require_component call for ' + component_name)
        continue
      }
      source = newtext
    }
  }
  return prefix_lines.join('\n') + '\n\n' + source + '\n\n' + match_ensure_string + suffix_lines.join('\n')
}

module.exports = {
  preprocess_javascript
}
