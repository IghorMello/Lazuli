(function(){
  var prelude, hso_server_url, ref$, get_interventions, get_enabled_interventions, get_manually_managed_interventions, set_intervention_enabled, set_intervention_disabled, set_intervention_automatically_managed, set_intervention_manually_managed, set_override_enabled_interventions_once, get_and_set_new_enabled_interventions_for_today, enable_interventions_because_goal_was_enabled, get_enabled_goals, get_goals, set_goal_enabled_manual, set_goal_disabled_manual, set_goal_target, get_goal_target, remove_custom_goal_and_generated_interventions, as_array, add_log_interventions, url_to_domain, localstorage_getjson, localstorage_setjson, localstorage_getbool, localstorage_setbool, localstorage_setstring, localstorage_getstring, post_json, get_json, once_available, get_user_id, get_canonical_domain, load_css_file, polymer_ext, swal;
  prelude = require('prelude-ls');
  hso_server_url = 'https://green-antonym-197023.wl.r.appspot.com';
  ref$ = require('libs_backend/intervention_utils'), get_interventions = ref$.get_interventions, get_enabled_interventions = ref$.get_enabled_interventions, get_manually_managed_interventions = ref$.get_manually_managed_interventions, set_intervention_enabled = ref$.set_intervention_enabled, set_intervention_disabled = ref$.set_intervention_disabled, set_intervention_automatically_managed = ref$.set_intervention_automatically_managed, set_intervention_manually_managed = ref$.set_intervention_manually_managed, set_override_enabled_interventions_once = ref$.set_override_enabled_interventions_once;
  ref$ = require('libs_backend/intervention_manager'), get_and_set_new_enabled_interventions_for_today = ref$.get_and_set_new_enabled_interventions_for_today, enable_interventions_because_goal_was_enabled = ref$.enable_interventions_because_goal_was_enabled;
  ref$ = require('libs_backend/goal_utils'), get_enabled_goals = ref$.get_enabled_goals, get_goals = ref$.get_goals, set_goal_enabled_manual = ref$.set_goal_enabled_manual, set_goal_disabled_manual = ref$.set_goal_disabled_manual, set_goal_target = ref$.set_goal_target, get_goal_target = ref$.get_goal_target, remove_custom_goal_and_generated_interventions = ref$.remove_custom_goal_and_generated_interventions;
  as_array = require('libs_common/collection_utils').as_array;
  add_log_interventions = require('libs_backend/log_utils').add_log_interventions;
  url_to_domain = require('libs_common/domain_utils').url_to_domain;
  ref$ = require('libs_common/localstorage_utils'), localstorage_getjson = ref$.localstorage_getjson, localstorage_setjson = ref$.localstorage_setjson, localstorage_getbool = ref$.localstorage_getbool, localstorage_setbool = ref$.localstorage_setbool, localstorage_setstring = ref$.localstorage_setstring, localstorage_getstring = ref$.localstorage_getstring;
  ref$ = require('libs_backend/ajax_utils'), post_json = ref$.post_json, get_json = ref$.get_json;
  once_available = require('libs_frontend/frontend_libs').once_available;
  get_user_id = require('libs_backend/background_common').get_user_id;
  get_canonical_domain = require('libs_backend/canonical_url_utils').get_canonical_domain;
  load_css_file = require('libs_common/content_script_utils').load_css_file;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  swal = require('sweetalert2');
  polymer_ext({
    is: 'options-interventions',
    properties: {
      enabled_goals: {
        type: Array,
        value: {}
      },
      start_time_string: {
        type: String,
        value: localStorage.start_as_string ? localStorage.start_as_string : '9:00 AM'
      },
      end_time_string: {
        type: String,
        value: localStorage.end_as_string ? localStorage.end_as_string : '5:00 PM'
      },
      start_time_mins: {
        type: Number,
        value: localStorage.start_mins_since_midnight ? parseInt(localStorage.start_mins_since_midnight) : 540
      },
      end_time_mins: {
        type: Number,
        value: localStorage.end_mins_since_midnight ? parseInt(localStorage.end_mins_since_midnight) : 1020
      },
      activedaysarray: {
        type: Array,
        value: localStorage.activedaysarray != null
          ? JSON.parse(localStorage.activedaysarray)
          : [0, 1, 2, 3, 4, 5, 6]
      },
      always_active: {
        type: Boolean,
        value: localStorage.work_hours_only !== "true"
      },
      days: {
        type: Array,
        value: ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']
      },
      seen_tutorial: {
        type: Boolean,
        value: localStorage.seen_tutorial !== "true"
      },
      popup_view_has_been_opened: {
        type: Boolean,
        value: localStorage.popup_view_has_been_opened === 'true'
      },
      positive_goals_disabled: {
        type: Boolean,
        value: localStorage.positive_goals_disabled === 'true'
      },
      sync_enabled: {
        type: Boolean,
        value: localStorage.sync_with_mobile != null && localStorage.sync_with_mobile === 'true'
      }
    },
    select_new_interventions: function(evt){
      var self;
      self = this;
      self.goals_and_interventions = [];
      return get_and_set_new_enabled_interventions_for_today(function(){
        return self.rerender();
      });
    },
    on_goal_changed: function(evt){
      return this.rerender();
    },
    is_active_for_day_idx: function(dayidx, activedaysarray){
      return activedaysarray.includes(dayidx);
    },
    change_intervention_activeness: function(evt){
      var day_index;
      localStorage.work_hours_only = true;
      day_index = evt.target.dataDay;
      if (!evt.target.isdayenabled) {
        this.activedaysarray.push(day_index);
        this.activedaysarray = JSON.parse(JSON.stringify(this.activedaysarray));
        localStorage.activedaysarray = JSON.stringify(this.activedaysarray);
      } else {
        this.activedaysarray = this.activedaysarray.filter(function(it){
          return it !== day_index;
        });
        this.activedaysarray = JSON.parse(JSON.stringify(this.activedaysarray));
        localStorage.activedaysarray = JSON.stringify(this.activedaysarray);
      }
    },
    goals_set: function(evt){
      if (Object.keys(this.enabled_goals).length > 0) {
        evt.target.style.display = "none";
        return this.$$('#intro1').style.display = "block";
      }
    },
    intro1_read: function(evt){
      return evt.target.style.display = "none";
    },
    intro2_read: function(evt){
      evt.target.style.display = "none";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    show_how_hl_works: function(evt){
      evt.target.style.display = "none";
      return this.$$('#how_hl_works').style.display = "block";
    },
    get_icon: function(){
      return chrome.extension.getURL('icons/icon_19.png');
    },
    intro3_read: function(evt){
      evt.target.style.display = "none";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    intro4_read: function(evt){
      evt.target.style.display = "none";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    intro5_read: function(evt){
      evt.target.style.display = "none";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    show_swal: function(){
      this.$$('#popup-button').style.display = 'none';
      swal({
        title: 'Tutorial Complete!',
        text: 'Isso é tudo que você precisa saber para começar a usar o Lazuli. Se desejar, você pode configurar mais opções e ver a lista de intervenções para cada meta no final desta página.',
        type: 'success',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      this.$$('#configurations').style.display = "block";
      return window.scrollTo(0, document.body.scrollHeight);
    },
    show_intro_button_clicked: function(){
      this.$$('#intro1_content').style.display = 'block';
      this.$$('#intro2').style.display = 'block';
      return this.$$('#intro4').style.display = 'block';
    },
    attached: function(){
      var i$, ref$, len$, elem, results$ = [];
      if (window.location.hash !== '#introduction') {
        for (i$ = 0, len$ = (ref$ = Polymer.dom(this.root).querySelectorAll('.intro')).length; i$ < len$; ++i$) {
          elem = ref$[i$];
          results$.push(elem.style.display = 'inline-flex');
        }
        return results$;
      }
    },
    ready: async function(){
      var survey_data;
      this.rerender();
      load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
      survey_data = localstorage_getjson("survey_data");
      if (deepEq$(survey_data, undefined, '===') || deepEq$(survey_data, null, '===')) {
        localstorage_setjson("survey_data", {});
        return this.check_for_survey();
      } else if (!deepEq$(survey_data, {}, '===')) {
        return once_available("survey_button", this.enable_survey_button());
      } else {
        return this.check_for_survey();
      }
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
      button.style.display = "inline-block";
      button.disabled = false;
      return this.$$('#surveycard').style.display = 'block';
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
        url: survey_data.url + '?lazuli_userid=' + userid + '&click_location=settings'
      });
      post_json(hso_server_url + "/surveyClicked", {
        "_id": survey_data._id,
        "userid": userid,
        "click_location": "settings"
      });
      return this.disable_survey_button();
    },
    show_randomize_button: function(){
      return localStorage.getItem('intervention_view_show_randomize_button') === 'true';
    },
    have_interventions_available: function(goals_and_interventions){
      return goals_and_interventions && goals_and_interventions.length > 0;
    },
    show_dialog: function(evt){
      if (evt.target.id === 'start-time') {
        return this.$$('#start-dialog').toggle();
      } else {
        return this.$$('#end-dialog').toggle();
      }
    },
    toggle_timepicker_idx: function(evt){
      var buttonidx;
      buttonidx = evt.detail.buttonidx;
      if (buttonidx === 1) {
        localStorage.work_hours_only = true;
        this.always_active = false;
        localStorage.start_mins_since_midnight = this.start_time_mins;
        localStorage.end_mins_since_midnight = this.end_time_mins;
        localStorage.start_as_string = this.start_time_string;
        return localStorage.end_as_string = this.end_time_string;
      } else {
        localStorage.work_hours_only = false;
        return this.always_active = true;
      }
    },
    toggle_timepicker: function(evt){
      if (evt.target.checked) {
        if (this.$$('paper-radio-group').selected === 'always') {
          localStorage.work_hours_only = true;
          this.always_active = false;
          localStorage.start_mins_since_midnight = this.start_time_mins;
          localStorage.end_mins_since_midnight = this.end_time_mins;
          localStorage.start_as_string = this.start_time_string;
          return localStorage.end_as_string = this.end_time_string;
        } else {
          localStorage.work_hours_only = false;
          return this.always_active = true;
        }
      }
    },
    dismiss_dialog: function(evt){
      if (evt.detail.confirmed) {
        if (evt.target.id === 'start-dialog') {
          this.start_time_string = this.$$('#start-picker').time;
          this.start_time_mins = this.$$('#start-picker').rawValue;
          localStorage.start_mins_since_midnight = this.start_time_mins;
          return localStorage.start_as_string = this.start_time_string;
        } else {
          this.end_time_string = this.$$('#end-picker').time;
          this.end_time_mins = this.$$('#end-picker').rawValue;
          localStorage.end_mins_since_midnight = this.end_time_mins;
          return localStorage.end_as_string = this.end_time_string;
        }
      } else {
        this.$$('#start-picker').time = this.start_time_string;
        return this.$$('#end-picker').time = this.end_time_string;
      }
    },
    determine_selected: function(always_active){
      if (always_active) {
        return 'always';
      } else {
        return 'workday';
      }
    },
    determine_selected_idx: function(always_active){
      if (always_active) {
        return 0;
      } else {
        return 1;
      }
    },
    sort_custom_goals_and_interventions_after: function(goals_and_interventions){
      var ref$, custom_goals_and_interventions, normal_goals_and_interventions, this$ = this;
      ref$ = prelude.partition(function(it){
        return it.goal.custom;
      }, goals_and_interventions), custom_goals_and_interventions = ref$[0], normal_goals_and_interventions = ref$[1];
      return normal_goals_and_interventions.concat(custom_goals_and_interventions);
    },
    help_icon_clicked: function(){
      return swal({
        title: 'Como o Lazuli funciona',
        html: 'O Lazuli o ajudará a atingir seu objetivo, mostrando a você um <i> cutucão </i> diferente, como um bloqueador de feed de notícias ou um carregador de página atrasado, cada vez que você visitar o site de seu objetivo.\n\n<br><br>\nA princípio, o Lazuli mostrará um toque aleatório a cada visita e, com o tempo, aprenderá o que funciona de maneira mais eficaz para você.\n\n<br><br>\n\nA cada visita, o Lazuli testará um novo toque e medirá quanto tempo você passa no site. Em seguida, ele determina a eficácia de cada nudge comparando o tempo gasto por visita quando aquele nudge foi implantado, em comparação com quando outros alertas são implantados. O Lazuli usa uma técnica algorítmica chamada <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank"> multiarmed-bandit </a> para aprender quais cutucadas funcionam melhor e escolher que cutuca para implantar, para minimizar o tempo perdido online.',
        allowOutsideClick: true,
        allowEscapeKey: true
      });
    },
    rerender_idea_generation: function(){
      return this.$.idea_generation.rerender();
    },
    rerender_privacy_options: function(){
      return this.$.privacy_options.rerender();
    },
    rerender: async function(){
      (await this.$$('#goal_selector').set_sites_and_goals());
      if (this.$$('#positive_goal_selector') != null) {
        return (await this.$$('#positive_goal_selector').set_sites_and_goals());
      }
    }
  }, [
    {
      source: require('libs_common/localization_utils'),
      methods: ['msg']
    }, {
      source: require('libs_frontend/polymer_methods'),
      methods: ['text_if_elem_in_array', 'text_if_elem_not_in_array']
    }
  ]);
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
}).call(this);
