const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils');

const {
  get_num_enabled_goals,
  get_goals,
  get_enabled_goals
} = require('libs_backend/goal_utils');

const {
  get_num_goals_met_this_week,
  get_progress_on_enabled_goals_this_week
} = require('libs_backend/goal_progress');

const moment = require('moment');

polymer_ext({
  is: 'goals-met-over-time',

  properties: {
    goal_name_to_info: {
      type: Object,
      value: {}
    },

    day_info_list: {
      type: Array,
      value: []
    },

    selected_day_idx: {
      type: Number,
      value: 0
    },
  },

  get_day_name: function (day_num) {
    return this.day_num_to_day_name[day_num];
  },

  get_day_in_month: function (day_num) {
    return moment().subtract(day_num, 'days').date();
  },

  is_first_day: function (day_num) {
    return day_num == 0;
  },

  get_progress_message: function (progress_on_enabled_goals, day_idx, goal_name) {
    if (!progress_on_enabled_goals) {
      return ''
    }

    if (!progress_on_enabled_goals[goal_name]) {
      return ''
    }

    if (!progress_on_enabled_goals[goal_name][day_idx]) {
      return ''
    }
    return progress_on_enabled_goals[goal_name][day_idx].message
  },

  day_clicked: function (evt) {
    var day_idx = evt.target.day_idx;
    this.selected_day_idx = day_idx;
  },

  helper_function: async function () {
    return 3;
  },

  get_icon_for_goal_name: function (goal_name, goal_name_to_info) {
    if (goal_name_to_info[goal_name]) {
      return goal_name_to_info[goal_name].icon
    }
    return ''
  },

  get_description_for_goal_name: function (goal_name, goal_name_to_info) {
    if (goal_name_to_info[goal_name]) {
      return goal_name_to_info[goal_name].description
    }
    return ''
  },

  get_description_of_goal_progress: function (day_info) {
    let today = moment().startOf('date')

    if (day_info.name == today.format("dddd"))
      return 'Você está se encontrando até agora ' + day_info.goals_met + ' fora de ' + day_info.goals_enabled + ' objetivos hoje.'

    return 'Você conheceu ' + day_info.goals_met + ' fora de ' + day_info.goals_enabled + ' goals on this day.'
  },

  ready: async function () {
    let self = this
    let day_info_list = [];
    for (let day_num = 0; day_num <= 6; ++day_num) {
      day_info_list[day_num] = {}
    }

    let day = moment().startOf('date')
    let day_num_to_num_goals_met = await get_num_goals_met_this_week()
    let num_enabled_goals = await get_num_enabled_goals()
    let enabled_goals = await get_enabled_goals()

    for (let day_num = 0; day_num <= 6; ++day_num) {
      day_info_list[day_num].name = day.format("dddd");
      day.subtract(1, 'days');
      day_info_list[day_num].day_num = day_num
      day_info_list[day_num].day_in_month = this.get_day_in_month(day_num)
      day_info_list[day_num].goals_enabled = num_enabled_goals;
      day_info_list[day_num].goals_met = day_num_to_num_goals_met[day_num];
      day_info_list[day_num].goal_progress = []
    }

    let goal_name_to_progress_this_week = await get_progress_on_enabled_goals_this_week()

    for (let goal_name of Object.keys(goal_name_to_progress_this_week)) {
      let goal_progress_each_day = goal_name_to_progress_this_week[goal_name]

      for (let day_num = 0; day_num < goal_progress_each_day.length; ++day_num) {
        let progress_for_day = JSON.parse(JSON.stringify(goal_progress_each_day[day_num]))
        progress_for_day.goal_name = goal_name
        day_info_list[day_num].goal_progress.push(progress_for_day)
      }
    }

    day_info_list.reverse()
    this.day_info_list = day_info_list

    this.goal_name_to_info = await get_goals();
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'text_if_equal',
    'is_equal'
  ]
});
