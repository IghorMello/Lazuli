{polymer_ext} = require 'libs_frontend/polymer_utils'

swal = require 'sweetalert2'

{
  load_css_file
} = require 'libs_common/content_script_utils'

{
  set_intervention_disabled
  set_intervention_disabled_permanently
} = require 'libs_common/intervention_utils'

{
  disable_lazuli
} = require 'libs_common/disable_lazuli_utils'

{
  open_url_in_new_tab
} = require 'libs_common/tab_utils'

{
  get_goals
} = require 'libs_common/goal_utils'

{
  add_log_lazuli_disabled
  add_log_interventions
} = require 'libs_common/log_utils'

intervention = require('libs_common/intervention_info').get_intervention()

polymer_ext {
  is: 'lazuli-options-popup-v2'
  doc: 'Um pop-up de opções do Lazuli para que o usuário desligue o nudge atual ou o Lazuli'

  properties: {
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }

    intervention: {
      type: String
      value: if intervention? then intervention.name else ''
      observer: 'intervention_changed'
    }
    
    intervention_description: {
      type: String
      value: if intervention? then intervention.description else ''
    }
    goal_descriptions: {
      type: String
      #value: if intervention? then (intervention.goals.map((.description)).join(', ')) else ''
    }
    goal_name_to_info: {
      type: Object
    }
    screenshot: {
      type: String
    }
    other: {
      type: Object
      value: {}
    }
    intervention_name: {
      type: String
      value: if intervention? then intervention.displayname else ''
    }
  }

  get_intervention_icon_url: ->
    if intervention.generic_intervention?
      url_path = 'interventions/'+ intervention.generic_intervention + '/icon.svg'
    
    else
      if intervention.custom == true
        url_path = 'icons/custom_intervention_icon.svg'
    
      else
        url_path = 'interventions/'+ intervention.name + '/icon.svg'
    return (chrome.extension.getURL(url_path)).toString()

  isdemo_changed: ->
    if this.isdemo
      this.open()
  
  intervention_changed: ->>
    if not this.goal_name_to_info?
      this.goal_name_to_info = await get_goals()
  
    goal_name_to_info = this.goal_name_to_info
    goal_names = intervention.goals
  
    this.goal_descriptions = goal_names.map(-> goal_name_to_info[it]).map((.description)).join(', ')
  
  ready: ->>
    await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
  
  open: ->
    this.$$('#intervention_info_dialog').open()
  
  disable_temp_callback: ->>
    this.$$('#intervention_info_dialog').close()
    self = this
    this.fire('disable_intervention')
  
    swal {
      title: 'Desligado!'
      text: 'Esta intervenção será desativada temporariamente.'
    }

    add_log_interventions {
      type: 'intervention_set_temporarily_disabled'
      page: 'lazuli-logo-v2'
      subpage: 'lazuli-options-popup-v2'
      category: 'intervention_enabledisable'
      now_enabled: false
      is_permanent: false
      manual: true
      url: window.location.href
      intervention_name: this.intervention
    }

  disable_perm_callback: ->>
    this.$$('#intervention_info_dialog').close()
    self = this
    this.fire('disable_intervention')

    swal {
      title: 'Desligado!'
      text: 'Esta intervenção será desativada permanentemente. Você pode reativá-lo na página de configurações do Lazuli.'
    }

    set_intervention_disabled_permanently(this.intervention)

    add_log_interventions {
      type: 'intervention_set_always_disabled'
      page: 'lazuli-logo-v2'
      subpage: 'lazuli-options-popup-v2'
      category: 'intervention_enabledisable'
      now_enabled: false
      is_permanent: true
      manual: true
      url: window.location.href
      intervention_name: this.intervention
    }

  disable_lazuli_callback: ->
    this.$$('#intervention_info_dialog').close()
    disable_lazuli()

    swal {
      title: 'Lazuli desativado!',
      text: 'Lazuli não mostrarei intervenções para o resto do dia.'
    }

    add_log_lazuli_disabled({
      page: 'lazuli-options-popup-v2',
      reason: 'turn_off_lazuli_in_turn_off_intervention'
      loaded_intervention: this.intervention
      loaded_interventions: [this.intervention]
      url: window.location.href
    })

  open_interventions_page: ->
    open_url_in_new_tab('options.html#interventions')
    this.$$('#intervention_info_dialog').close()
  
  open_feedback_form: ->>
    feedback_form = document.createElement('feedback-form')
    feedback_form.screenshot = this.screenshot
    feedback_form.other = this.other
    this.$$('#intervention_info_dialog').close()
    document.body.appendChild(feedback_form)
    feedback_form.open()
}