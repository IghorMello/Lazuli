const {
  close_selected_tab
} = require('libs_common/tab_utils')

const {
  load_css_file,
} = require('libs_common/content_script_utils')

const {
  get_seconds_spent_on_current_domain_today,
  get_minutes_spent_on_domain_today,
} = require('libs_common/time_spent_utils');

const {
  url_to_domain,
} = require('libs_common/domain_utils');

const {
  polymer_ext
} = require('libs_frontend/polymer_utils');

const {
  get_intervention,
  get_goal_info,
} = require('libs_common/intervention_info');

polymer_ext({
  is: 'fb-scroll-block-display',
  doc: 'Block facebook scrolling',

  properties: {
    minutes: {
      type: Number,
    },

    site: {
      type: String,
      value: get_goal_info().sitename_printable
    },

    visits: {
      type: Number,
    },

    clr: {
      type: String,
      value: "#95CBEE;",
    }
  },

  listeners: {},

  continue_scrolling: function (event) {
    this.fire('continue_scrolling', {})
  },

  ready: function () {
    const self = this;

    var update_time = () => {
      get_seconds_spent_on_current_domain_today().then(function (seconds_spent) {
        self.minutes = Math.floor(seconds_spent / 60);
        self.seconds = seconds_spent % 60;
      });
    };

    update_time();
    setInterval(update_time, 1000);
  },
});