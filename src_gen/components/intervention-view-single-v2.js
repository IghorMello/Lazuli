/* livescript */

var ref$, get_enabled_interventions, set_intervention_enabled, set_intervention_disabled, set_intervention_automatically_managed, set_intervention_manually_managed, get_intervention_parameters, set_intervention_parameter, set_override_enabled_interventions_once, list_custom_interventions, get_interventions, remove_custom_intervention, add_log_interventions, localstorage_getbool, polymer_ext;
ref$ = require('libs_backend/intervention_utils'), get_enabled_interventions = ref$.get_enabled_interventions, set_intervention_enabled = ref$.set_intervention_enabled, set_intervention_disabled = ref$.set_intervention_disabled, set_intervention_automatically_managed = ref$.set_intervention_automatically_managed, set_intervention_manually_managed = ref$.set_intervention_manually_managed, get_intervention_parameters = ref$.get_intervention_parameters, set_intervention_parameter = ref$.set_intervention_parameter, set_override_enabled_interventions_once = ref$.set_override_enabled_interventions_once, list_custom_interventions = ref$.list_custom_interventions, get_interventions = ref$.get_interventions, remove_custom_intervention = ref$.remove_custom_intervention;
add_log_interventions = require('libs_backend/log_utils').add_log_interventions;
localstorage_getbool = require('libs_common/localstorage_utils').localstorage_getbool;
polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
polymer_ext({
  is: 'intervention-view-single-v2',
  properties: {
    intervention: {
      type: Object,
      observer: 'intervention_property_changed'
    },
    enabled: {
      type: Boolean,
      observer: 'enabled_changed'
    },
    pill_button_idx: {
      type: Number,
      computed: 'get_pill_button_idx(enabled)'
    },
    goal: {
      type: Object
    },
    sitename: {
      type: String,
      computed: 'compute_sitename(goal)'
    },
    custom: {
      type: Boolean,
      computed: 'compute_custom(intervention)'
    },
    downloaded: {
      type: Boolean,
      computed: 'compute_downloaded(intervention)'
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    }
  },
  isdemo_changed: async function(isdemo){
    if (isdemo) {
      return this.intervention = (await get_interventions())['facebook/remove_news_feed'];
    }
  }
  /*
  get_pill_button_tooltip: (pill_button_idx) ->
    if pill_button_idx == 0
      return "Each time you visit Facebook,<br>Lazuli will show one of the<br>'Sometimes Shown' interventions."
    else if pill_button_idx == 1
      return "A 'Never Shown' intervention<br>is disabled and will not be shown."
  */,
  compute_custom: function(intervention){
    if (intervention != null) {
      return intervention.custom === true;
    }
    return false;
  },
  compute_downloaded: function(intervention){
    if (intervention != null) {
      if (localStorage['downloaded_intervention_' + intervention.name] != null) {
        console.log("true");
        return true;
      }
    }
    return false;
  },
  compute_sitename: function(goal){
    return goal.sitename_printable;
  },
  test_function: function(isDownloaded, isCustom){
    return !isDownloaded && isCustom;
  },
  intervention_property_changed: function(intervention, old_intervention){
    if (intervention == null) {
      return;
    }
    return this.enabled = intervention.enabled;
  },
  get_intervention_icon_url: function(intervention){
    var url_path;
    if (intervention != null) {
      if (intervention.generic_intervention != null) {
        url_path = 'interventions/' + intervention.generic_intervention + '/icon.svg';
      } else {
        if (intervention.custom === true) {
          url_path = 'icons/custom_intervention_icon.svg';
        } else {
          url_path = 'interventions/' + intervention.name + '/icon.svg';
        }
      }
      return chrome.extension.getURL(url_path).toString();
    }
    url_path = 'icons/custom_intervention_icon.svg';
    return chrome.extension.getURL(url_path).toString();
  }
  /*
  automatic_and_enabled: (automatic, enabled) ->
    return automatic and enabled
  automatic_and_disabled: (automatic, enabled) ->
    return automatic and !enabled
  automatic_changed: (automatic, old_automatic) ->
    this.intervention.automatic = automatic
  */,
  enabled_changed: function(enabled, old_enabled){
    return this.intervention.enabled = enabled;
  },
  display_internal_names_for_interventions: function(){
    return localstorage_getbool('intervention_view_show_internal_names');
  },
  is_generic_intervention: async function(intervention_name){
    var all_interventions, ourput, intervention_info, output;
    all_interventions = (await get_interventions());
    ourput = false;
    intervention_info = all_interventions[intervention_name];
    if (intervention_info.generic_intervention != null) {
      output = true;
    }
    return output;
  },
  is_generic_intervention_sync: function(intervention_name, is_generic_intervention){
    return is_generic_intervention(intervention_name);
  }
  /*
  pill_button_selected: (evt) ->>
    buttonidx = evt.detail.buttonidx
    if buttonidx == 1 # smartly managed
      this.automatic = true
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_enabled this.intervention.name
      await set_intervention_automatically_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_smartly_managed'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else if buttonidx == 0 # never shown
      this.enabled = false
      this.automatic = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_disabled this.intervention.name
      await set_intervention_manually_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_always_disabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
  */,
  pill_button_selected: async function(evt){
    var buttonidx, is_enabled, prev_enabled_interventions, generic_intervention_changed;
    buttonidx = evt.detail.buttonidx;
    is_enabled = buttonidx === 1;
    if (is_enabled) {
      this.enabled = true;
      prev_enabled_interventions = (await get_enabled_interventions());
      (await set_intervention_enabled(this.intervention.name));
      add_log_interventions({
        type: 'intervention_set_smartly_managed',
        page: 'site-view',
        subpage: 'intervention-view-single-compact',
        category: 'intervention_enabledisable',
        now_enabled: true,
        is_permanent: true,
        manual: true,
        url: window.location.href,
        intervention_name: this.intervention.name,
        prev_enabled_interventions: prev_enabled_interventions
      });
    } else {
      this.enabled = false;
      prev_enabled_interventions = (await get_enabled_interventions());
      (await set_intervention_disabled(this.intervention.name));
      add_log_interventions({
        type: 'intervention_set_always_disabled',
        page: 'site-view',
        subpage: 'intervention-view-single-v2',
        category: 'intervention_enabledisable',
        now_enabled: false,
        is_permanent: true,
        manual: true,
        url: window.location.href,
        intervention_name: this.intervention.name,
        prev_enabled_interventions: prev_enabled_interventions
      });
    }
    if (this.intervention.generic_intervention != null) {
      generic_intervention_changed = document.querySelector('enabledisable-intervention-all-sites');
      if (generic_intervention_changed == null) {
        generic_intervention_changed = document.createElement('enabledisable-intervention-all-sites');
        document.body.appendChild(generic_intervention_changed);
      }
      generic_intervention_changed.intervention = this.intervention;
      generic_intervention_changed.is_enabled = is_enabled;
      return generic_intervention_changed.show();
    }
  },
  get_pill_button_idx: function(enabled){
    if (enabled) {
      return 1;
    } else {
      return 0;
    }
  }
  /*
  get_dropdown_idx: (automatic, enabled) ->
    if !automatic
      if enabled
        return 1
      else
        return 2
    return 0
  */,
  preview_intervention: function(){
    var intervention_name, preview_page, ref$;
    intervention_name = this.intervention.name;
    set_override_enabled_interventions_once(intervention_name);
    preview_page = (ref$ = this.intervention.preview) != null
      ? ref$
      : (ref$ = this.goal.preview) != null
        ? ref$
        : this.goal.homepage;
    return chrome.tabs.create({
      url: preview_page
    });
  },
  parameters_shown: function(){
    return localstorage_getbool('intervention_view_show_parameters');
  },
  edit_custom_intervention: function(){
    localStorage.setItem('intervention_editor_open_intervention_name', JSON.stringify(this.intervention.name));
    return chrome.tabs.create({
      url: chrome.extension.getURL('index.html?tag=intervention-editor')
    });
  },
  delete_custom_intervention: function(){
    var self;
    self = this;
    remove_custom_intervention(this.intervention.name);
    return self.fire('download-deleted', {});
  }
  /*
  dropdown_menu_changed: (evt) ->>
    selected = this.$$('#enabled_selector').selected
    if selected == 0 and this.automatic
      return
    if selected == 1 and !this.automatic and this.enabled
      return
    if selected == 2 and !this.automatic and !this.enabled
      return
    if selected == 0
      this.automatic = true
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_automatically_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_smartly_managed'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    if selected == 1
      this.enabled = true
      this.automatic = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_enabled this.intervention.name
      await set_intervention_manually_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_always_enabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
    if selected == 2
      this.enabled = false
      this.automatic = false
      prev_enabled_interventions = await get_enabled_interventions()
      await set_intervention_disabled this.intervention.name
      await set_intervention_manually_managed this.intervention.name
      add_log_interventions {
        type: 'intervention_set_always_disabled'
        manual: true
        intervention_name: this.intervention.name
        prev_enabled_interventions: prev_enabled_interventions
      }
  temporarily_enable: (evt) ->>
    this.enabled = true
    prev_enabled_interventions = await get_enabled_interventions()
    intervention_name = this.intervention.name
    await set_intervention_enabled intervention_name
    add_log_interventions {
      type: 'intervention_temporarily_enabled'
      manual: true
      intervention_name: intervention_name
      prev_enabled_interventions: prev_enabled_interventions
    }
  temporarily_disable: (evt) ->>
    this.enabled = false
    prev_enabled_interventions = await get_enabled_interventions()
    intervention_name = this.intervention.name
    await set_intervention_disabled intervention_name
    add_log_interventions {
      type: 'intervention_temporarily_disabled'
      manual: true
      intervention_name: intervention_name
      prev_enabled_interventions: prev_enabled_interventions
    }
  */
  /*
  intervention_changed: (evt) ->>
    checked = evt.target.checked
    #this.enabled = !checked
    prev_enabled_interventions = await get_enabled_interventions()
    intervention_name = this.intervention.name
    if checked
      await set_intervention_enabled intervention_name
      add_log_interventions {
        type: 'intervention_checked'
        manual: true
        intervention_name: intervention_name
        prev_enabled_interventions: prev_enabled_interventions
      }
    else
      await set_intervention_disabled intervention_name
      add_log_interventions {
        type: 'intervention_unchecked'
        manual: true
        intervention_name: intervention_name
        prev_enabled_interventions: prev_enabled_interventions
      }
  */,
  ready: function(){
    if (this.intervention != null) {
      return console.log("hello!!!");
    }
  }
});