/* livescript */

var hso_server_url, polymer_ext, load_css_file, ref$, add_log_feedback, add_log_interventions, add_log_lazuli_disabled, add_log_lazuli_enabled, swal_cached, get_swal, screenshot_utils_cached, get_screenshot_utils, get_active_tab_url, get_active_tab_id, list_currently_loaded_interventions, list_currently_loaded_interventions_for_tabid, get_active_tab_info, disable_interventions_in_active_tab, open_debug_page_for_tab_id, url_to_domain, set_intervention_disabled, list_enabled_interventions_for_location, set_intervention_disabled_permanently, get_enabled_interventions, set_intervention_enabled, get_nonpositive_goals_and_interventions, list_available_interventions_for_location, get_interventions, is_it_outside_work_hours, get_seconds_spent_on_all_domains_today, is_lazuli_enabled, disable_lazuli, enable_lazuli, list_sites_for_which_goals_are_enabled, list_goals_for_site, set_goal_enabled, set_goal_disabled, add_enable_custom_goal_reduce_time_on_domain, localstorage_getjson, localstorage_setjson, localstorage_getbool, localstorage_setbool, localstorage_setstring, localstorage_getstring, post_json, get_json, get_user_id, once_available;
hso_server_url = 'https://green-antonym-197023.wl.r.appspot.com';
polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
load_css_file = require('libs_common/content_script_utils').load_css_file;
ref$ = require('libs_backend/log_utils'), add_log_feedback = ref$.add_log_feedback, add_log_interventions = ref$.add_log_interventions, add_log_lazuli_disabled = ref$.add_log_lazuli_disabled, add_log_lazuli_enabled = ref$.add_log_lazuli_enabled;
swal_cached = null;
get_swal = async function(){
  if (swal_cached != null) {
    return swal_cached;
  }
  swal_cached = (await SystemJS['import']('sweetalert2'));
  return swal_cached;
};
screenshot_utils_cached = null;
get_screenshot_utils = async function(){
  if (screenshot_utils_cached != null) {
    return screenshot_utils_cached;
  }
  screenshot_utils_cached = (await SystemJS['import']('libs_common/screenshot_utils'));
  return screenshot_utils_cached;
};
ref$ = require('libs_backend/background_common'), get_active_tab_url = ref$.get_active_tab_url, get_active_tab_id = ref$.get_active_tab_id, list_currently_loaded_interventions = ref$.list_currently_loaded_interventions, list_currently_loaded_interventions_for_tabid = ref$.list_currently_loaded_interventions_for_tabid, get_active_tab_info = ref$.get_active_tab_info, disable_interventions_in_active_tab = ref$.disable_interventions_in_active_tab, open_debug_page_for_tab_id = ref$.open_debug_page_for_tab_id;
open_debug_page_for_tab_id = require('libs_backend/debug_console_utils').open_debug_page_for_tab_id;
url_to_domain = require('libs_common/domain_utils').url_to_domain;
ref$ = require('libs_backend/intervention_utils'), set_intervention_disabled = ref$.set_intervention_disabled, list_enabled_interventions_for_location = ref$.list_enabled_interventions_for_location, set_intervention_disabled_permanently = ref$.set_intervention_disabled_permanently, get_enabled_interventions = ref$.get_enabled_interventions, set_intervention_enabled = ref$.set_intervention_enabled, get_nonpositive_goals_and_interventions = ref$.get_nonpositive_goals_and_interventions, list_available_interventions_for_location = ref$.list_available_interventions_for_location, get_interventions = ref$.get_interventions, is_it_outside_work_hours = ref$.is_it_outside_work_hours;
get_seconds_spent_on_all_domains_today = require('libs_common/time_spent_utils').get_seconds_spent_on_all_domains_today;
ref$ = require('libs_common/disable_lazuli_utils'), is_lazuli_enabled = ref$.is_lazuli_enabled, disable_lazuli = ref$.disable_lazuli, enable_lazuli = ref$.enable_lazuli;
ref$ = require('libs_backend/goal_utils'), list_sites_for_which_goals_are_enabled = ref$.list_sites_for_which_goals_are_enabled, list_goals_for_site = ref$.list_goals_for_site, set_goal_enabled = ref$.set_goal_enabled, set_goal_disabled = ref$.set_goal_disabled, add_enable_custom_goal_reduce_time_on_domain = ref$.add_enable_custom_goal_reduce_time_on_domain;
ref$ = require('libs_common/localstorage_utils'), localstorage_getjson = ref$.localstorage_getjson, localstorage_setjson = ref$.localstorage_setjson, localstorage_getbool = ref$.localstorage_getbool, localstorage_setbool = ref$.localstorage_setbool, localstorage_setstring = ref$.localstorage_setstring, localstorage_getstring = ref$.localstorage_getstring;
ref$ = require('libs_backend/ajax_utils'), post_json = ref$.post_json, get_json = ref$.get_json;
get_user_id = require('libs_backend/background_common').get_user_id;
once_available = require('libs_frontend/frontend_libs').once_available;
polymer_ext({
  is: 'popup-view',
  properties: {
    enabledInterventions: {
      type: Array
    },
    feedbackText: {
      type: String,
      notify: true
    },
    graphOptions: {
      type: Array
    },
    shownGraphs: {
      type: Array
    },
    graphNamesToOptions: {
      type: Object
    },
    blacklist: {
      type: Object
    },
    sites: {
      type: Array
    },
    html_for_shown_graphs: {
      type: String,
      computed: 'compute_html_for_shown_graphs(shownGraphs, blacklist, sites)'
    },
    selected_tab_idx: {
      type: Number,
      value: 0
    },
    selected_graph_tab: {
      type: Number,
      value: 0
    },
    goals_and_interventions: {
      type: Array,
      value: []
    },
    intervention_name_to_info: {
      type: Object,
      value: {}
    },
    is_lazuli_disabled: {
      type: Boolean
    },
    stress_intervention_active: {
      type: Boolean
    },
    stress_intervention_display: {
      type: Boolean
    },
    ask_intervention_done: {
      type: Boolean
    },
    intervention_stress_before: {
      type: Boolean
    },
    intervention_stress_after: {
      type: Boolean
    },
    stress_intervention_data: {
      type: String,
      value: null
    },
    stress_intervention_end: {
      type: String,
      value: null
    }
  },
  get_intervention_description: function(intervention_name, intervention_name_to_info){
    return intervention_name_to_info[intervention_name].description;
  },
  noValidInterventions: function(){
    return deepEq$(this.goals_and_interventions.length, 0, '===');
  },
  temp_disable_button_clicked: async function(evt){
    var self, intervention, prev_enabled_interventions, tab_info, url, enabledInterventions, res$, i$, len$, x;
    self = this;
    intervention = evt.target.intervention;
    prev_enabled_interventions = (await get_enabled_interventions());
    tab_info = (await get_active_tab_info());
    url = tab_info.url;
    enabledInterventions = (await list_currently_loaded_interventions_for_tabid(tab_info.id));
    res$ = [];
    for (i$ = 0, len$ = enabledInterventions.length; i$ < len$; ++i$) {
      x = enabledInterventions[i$];
      if (x !== intervention) {
        res$.push(x);
      }
    }
    enabledInterventions = res$;
    self.enabledInterventions = enabledInterventions;
    (await disable_interventions_in_active_tab());
    this.fire('disable_intervention');
    return add_log_interventions({
      type: 'intervention_set_temporarily_disabled',
      page: 'popup-view',
      subpage: 'popup-view-active-intervention-tab',
      category: 'intervention_enabledisable',
      now_enabled: false,
      is_permanent: false,
      manual: true,
      url: window.location.href,
      tab_url: url,
      intervention_name: intervention,
      prev_enabled_interventions: prev_enabled_interventions
    });
  },
  perm_disable_button_clicked: async function(evt){
    var self, intervention, prev_enabled_interventions, tab_info, url, enabledInterventions, res$, i$, len$, x;
    self = this;
    intervention = evt.target.intervention;
    prev_enabled_interventions = (await get_enabled_interventions());
    (await set_intervention_disabled_permanently(intervention));
    tab_info = (await get_active_tab_info());
    url = tab_info.url;
    enabledInterventions = (await list_currently_loaded_interventions_for_tabid(tab_info.id));
    res$ = [];
    for (i$ = 0, len$ = enabledInterventions.length; i$ < len$; ++i$) {
      x = enabledInterventions[i$];
      if (x !== intervention) {
        res$.push(x);
      }
    }
    enabledInterventions = res$;
    self.enabledInterventions = enabledInterventions;
    (await disable_interventions_in_active_tab());
    this.fire('disable_intervention');
    return add_log_interventions({
      type: 'intervention_set_permanently_disabled',
      page: 'popup-view',
      subpage: 'popup-view-active-intervention-tab',
      category: 'intervention_enabledisable',
      now_enabled: false,
      is_permanent: false,
      manual: true,
      url: window.location.href,
      tab_url: url,
      intervention_name: intervention,
      prev_enabled_interventions: prev_enabled_interventions
    });
  },
  is_not_in_blacklist: function(graph, blacklist, graphNamesToOptions){
    graph = graphNamesToOptions[graph];
    return blacklist[graph] === false;
  },
  checkbox_checked_handler: function(evt){
    var self, graph;
    self = this;
    graph = evt.target.graph;
    self.blacklist[self.graphNamesToOptions[graph]] = !evt.target.checked;
    self.blacklist = JSON.parse(JSON.stringify(self.blacklist));
    return localstorage_setjson('popup_view_graph_blacklist', self.blacklist);
  },
  sortableupdated: function(evt){
    var self, shownGraphs, this$ = this;
    self = this;
    shownGraphs = this.$$('#graphlist_sortable').innerText.split('\n').map(function(it){
      return it.trim();
    }).filter(function(x){
      return x !== '';
    });
    return this.shownGraphs = shownGraphs.map(function(graph_name){
      return self.graphNamesToOptions[graph_name];
    });
  },
  compute_html_for_shown_graphs: function(shownGraphs, blacklist, sites){
    var self, html, i$, len$, x, j$, len1$, site;
    self = this;
    shownGraphs = shownGraphs.filter(function(x){
      return !self.blacklist[x];
    });
    html = "<div class=\"card-content\">";
    for (i$ = 0, len$ = shownGraphs.length; i$ < len$; ++i$) {
      x = shownGraphs[i$];
      if (x === 'site-goal-view') {
        for (j$ = 0, len1$ = sites.length; j$ < len1$; ++j$) {
          site = sites[j$];
          html += "<" + x + " site=\"" + site + "\"></" + x + "><br>";
        }
      } else {
        html += "<" + x + "></" + x + "><br>";
      }
    }
    html += "</div>";
    return html;
  },
  isEmpty: function(enabledInterventions){
    return enabledInterventions != null && enabledInterventions.length === 0;
  },
  outside_work_hours: function(){
    return is_it_outside_work_hours();
  },
  disable_lazuli_changed: async function(evt){
    var tab_info, loaded_interventions;
    if (evt.target.checked) {
      this.is_lazuli_disabled = true;
      disable_lazuli();
      tab_info = (await get_active_tab_info());
      loaded_interventions = (await list_currently_loaded_interventions_for_tabid(tab_info.id));
      return add_log_lazuli_disabled({
        page: 'popup-view',
        reason: 'disable_button_slider_toggle',
        tab_info: tab_info,
        url: tab_info != null ? tab_info.url : void 8,
        loaded_interventions: loaded_interventions,
        loaded_intervention: loaded_interventions[0]
      });
    } else {
      this.is_lazuli_disabled = false;
      enable_lazuli();
      tab_info = (await get_active_tab_info());
      loaded_interventions = (await list_currently_loaded_interventions_for_tabid(tab_info.id));
      return add_log_lazuli_enabled({
        page: 'popup-view',
        reason: 'disable_button_slider_toggle',
        tab_info: tab_info,
        url: tab_info != null ? tab_info.url : void 8,
        loaded_interventions: loaded_interventions
      });
    }
  },
  enable_lazuli_button_clicked: async function(){
    var tab_info, loaded_interventions;
    this.is_lazuli_disabled = false;
    enable_lazuli();
    tab_info = (await get_active_tab_info());
    loaded_interventions = (await list_currently_loaded_interventions_for_tabid(tab_info.id));
    return add_log_lazuli_enabled({
      page: 'popup-view',
      reason: 'enable_lazuli_big_button_clicked',
      tab_info: tab_info,
      loaded_interventions: loaded_interventions
    });
  },
  goal_enable_button_changed: async function(evt){
    var goal;
    goal = evt.target.goal;
    if (evt.target.checked) {
      if (goal.name != null) {
        (await set_goal_enabled(goal.name));
      } else {
        (await add_enable_custom_goal_reduce_time_on_domain(goal.domain));
      }
      return (await this.set_goals_and_interventions());
    } else {
      (await set_goal_disabled(goal.name));
      return (await this.set_goals_and_interventions());
    }
  },
  set_goals_and_interventions: async function(){
    var sites_promise, enabledInterventions_promise, intervention_name_to_info_promise, all_goals_and_interventions_promise, url_promise, ref$, sites, enabledInterventions, intervention_name_to_info, all_goals_and_interventions, url, domain, filtered_goals_and_interventions;
    sites_promise = list_sites_for_which_goals_are_enabled();
    enabledInterventions_promise = list_currently_loaded_interventions();
    intervention_name_to_info_promise = get_interventions();
    all_goals_and_interventions_promise = get_nonpositive_goals_and_interventions();
    url_promise = get_active_tab_url();
    ref$ = (await Promise.all([sites_promise, enabledInterventions_promise, intervention_name_to_info_promise, all_goals_and_interventions_promise, url_promise])), sites = ref$[0], enabledInterventions = ref$[1], intervention_name_to_info = ref$[2], all_goals_and_interventions = ref$[3], url = ref$[4];
    this.sites = sites;
    this.enabledInterventions = enabledInterventions;
    this.intervention_name_to_info = intervention_name_to_info;
    domain = url_to_domain(url);
    filtered_goals_and_interventions = all_goals_and_interventions.filter(function(obj){
      return obj.goal.domain === domain;
    });
    if (filtered_goals_and_interventions.length === 0) {
      filtered_goals_and_interventions = [{
        enabled: false,
        goal: {
          domain: domain,
          description: "Gaste menos tempo em " + domain
        }
      }];
    }
    return this.goals_and_interventions = filtered_goals_and_interventions;
  },
  get_power_icon_src: function(){
    return chrome.extension.getURL('icons/power_button.svg');
  },
  get_thumbs_icon_src: function(){
    return chrome.extension.getURL('icons/thumbs_i');
  },
  debug_button_clicked: async function(){
    var tab_id;
    tab_id = (await get_active_tab_id());
    return (await open_debug_page_for_tab_id(tab_id));
  },
  submit_feedback_clicked: async function(){
    var screenshot_utils, screenshot, data, feedback_form;
    screenshot_utils = (await get_screenshot_utils());
    screenshot = (await screenshot_utils.get_screenshot_as_base64());
    data = (await screenshot_utils.get_data_for_feedback());
    feedback_form = document.createElement('feedback-form');
    document.body.appendChild(feedback_form);
    feedback_form.screenshot = screenshot;
    feedback_form.other = data;
    return feedback_form.open();
  },
  help_icon_clicked: async function(){
    var swal;
    (await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css'));
    swal = (await get_swal());
    return swal({
      title: 'Como o Lazuli funciona',
      html: 'O Lazuli o ajudará a atingir seu objetivo, mostrando a você um <i> cutucão </i> diferente, como um bloqueador de feed de notícias ou um carregador de página atrasado, cada vez que você visitar o site de seu objetivo.\n\n<br> <br>\n\nA princípio, o Lazuli mostrará um toque aleatório a cada visita e, com o tempo, aprenderá o que funciona de maneira mais eficaz para você.\n\n<br> <br>\n\nA cada visita, o Lazuli testará um novo toque e medirá quanto tempo você passa no site. Em seguida, ele determina a eficácia de cada nudge comparando o tempo gasto por visita quando aquele nudge foi implantado, em comparação com quando outros alertas são implantados. O Lazuli usa uma técnica algorítmica chamada <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank"> multiarmed-bandit </a> para aprender quais cutucadas funcionam melhor e escolher que cutuca para implantar, para minimizar o tempo perdido online.',
      allowOutsideClick: true,
      allowEscapeKey: true
    });
  },
  check_for_survey: async function(){
    var userid, survey_data;
    userid = (await get_user_id());
    survey_data = JSON.parse((await get_json(hso_server_url + "/getSurvey", "userid=" + userid)));
    if (!deepEq$(survey_data, {}, '===')) {
      localstorage_setjson("survey_data", survey_data);
      return once_available("survey_button", this.enable_survey_button());
    }
  },
  enable_survey_button: async function(){
    var survey_data, button;
    survey_data = (await localstorage_getjson("survey_data"));
    button = document.getElementById("survey_button");
    button.innerHTML = survey_data.button_text;
    button.style.display = "flex";
    return button.disabled = false;
  },
  disable_survey_button: async function(){
    var button;
    localstorage_setjson("survey_data", {});
    button = document.getElementById("survey_button");
    button.style.display = "none";
    return button.disabled = true;
  },
  survey_button_clicked: async function(){
    var survey_data, userid;
    survey_data = localstorage_getjson("survey_data");
    userid = (await get_user_id());
    chrome.tabs.create({
      url: survey_data.url + '?lazuli_userid=' + userid + '&click_location=dropdown'
    });
    post_json(hso_server_url + "/surveyClicked", {
      "_id": survey_data._id,
      "userid": userid,
      "click_location": "dropdown"
    });
    return this.disable_survey_button();
  },
  results_button_clicked: function(){
    return chrome.tabs.create({
      url: 'options.html#overview'
    });
  },
  settings_button_clicked: function(){
    return chrome.tabs.create({
      url: 'options.html#settings'
    });
  },
  ready: async function(){
    var self, have_enabled_custom_interventions, survey_data;
    self = this;
    is_lazuli_enabled().then(function(is_enabled){
      return self.is_lazuli_disabled = !is_enabled;
    });
    (await this.set_goals_and_interventions());
    have_enabled_custom_interventions = self.enabledInterventions.map(function(it){
      return self.intervention_name_to_info[it];
    }).filter(function(it){
      return it != null ? it.custom : void 8;
    }).length > 0;
    if (self.enabledInterventions.length > 0 && (localstorage_getbool('enable_debug_terminal') || have_enabled_custom_interventions)) {
      self.S('#debugButton').show();
    }
    if (self.enabledInterventions.length === 0) {
      self.selected_tab_idx = 1;
    }
    localstorage_setbool('popup_view_has_been_opened', true);
    survey_data = localstorage_getjson("survey_data");
    if (deepEq$(survey_data, undefined, '===') || deepEq$(survey_data, null, '===')) {
      localstorage_setjson("survey_data", {});
      this.check_for_survey();
    } else if (!deepEq$(survey_data, {}, '===')) {
      once_available("survey_button", this.enable_survey_button());
    } else {
      this.check_for_survey();
    }
    return setTimeout(async function(){
      require('../bower_components/iron-icon/iron-icon.deps');
      require('../bower_components/iron-icons/iron-icons.deps');
      require('components/graph-donut-top-sites.deps');
      require('components/intervention-view-single-compact.deps');
      require('components/feedback-form.deps');
      (await get_screenshot_utils());
      return (await get_swal());
    }, 1);
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: ['S']
});
function deepEq$(x, y, type){
  var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
      has = function (obj, key) { return hasOwnProperty.call(obj, key); };
  var first = true;
  return eq(x, y, []);
  function eq(a, b, stack) {
    var className, length, size, result, alength, blength, r, key, ref, sizeB;
    if (a == null || b == null) { return a === b; }
    if (a.__placeholder__ || b.__placeholder__) { return true; }
    if (a === b) { return a !== 0 || 1 / a == 1 / b; }
    className = toString.call(a);
    if (toString.call(b) != className) { return false; }
    switch (className) {
      case '[object String]': return a == String(b);
      case '[object Number]':
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        return +a == +b;
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') { return false; }
    length = stack.length;
    while (length--) { if (stack[length] == a) { return true; } }
    stack.push(a);
    size = 0;
    result = true;
    if (className == '[object Array]') {
      alength = a.length;
      blength = b.length;
      if (first) {
        switch (type) {
        case '===': result = alength === blength; break;
        case '<==': result = alength <= blength; break;
        case '<<=': result = alength < blength; break;
        }
        size = alength;
        first = false;
      } else {
        result = alength === blength;
        size = alength;
      }
      if (result) {
        while (size--) {
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
        }
      }
    } else {
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
        return false;
      }
      for (key in a) {
        if (has(a, key)) {
          size++;
          if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
        }
      }
      if (result) {
        sizeB = 0;
        for (key in b) {
          if (has(b, key)) { ++sizeB; }
        }
        if (first) {
          if (type === '<<=') {
            result = size < sizeB;
          } else if (type === '<==') {
            result = size <= sizeB
          } else {
            result = size === sizeB;
          }
        } else {
          first = false;
          result = size === sizeB;
        }
      }
    }
    stack.pop();
    return result;
  }
}