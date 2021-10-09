(function(){
  var ref$, gexport, gexport_module, setvar_experiment, getvar_experiment, enabledisable_interventions_based_on_difficulty, send_feature_disabled, abtest_list, abtest_funcs, abtest_conditions, nondefault_abtest_list, blocking_abtest_list, blocking_abtest_set, nondefault_abtest_set, is_blocking_abtest, is_nondefault_abtest, get_available_abtest_conditions, get_abtest_list, get_abtest_set, get_assigned_abtest_conditions, add_abtest, set_abtest, run_abtest, setup_abtest_newuser, setup_abtest_olduser, out$ = typeof exports != 'undefined' && exports || this;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  ref$ = require('libs_backend/db_utils'), setvar_experiment = ref$.setvar_experiment, getvar_experiment = ref$.getvar_experiment;
  enabledisable_interventions_based_on_difficulty = require('libs_backend/intervention_utils').enabledisable_interventions_based_on_difficulty;
  send_feature_disabled = require('libs_backend/logging_enabled_utils').send_feature_disabled;
  abtest_list = [];
  abtest_funcs = {};
  abtest_conditions = {};
  nondefault_abtest_list = ['internal_special_user', 'difficulty_selection_screen', 'frequency_of_choose_difficulty'];
  blocking_abtest_list = ['difficulty_selection_screen_and_choose_difficulty_frequency', 'difficulty_selection_screen'];
  blocking_abtest_set = new Set(blocking_abtest_list);
  nondefault_abtest_set = new Set(nondefault_abtest_list);
  is_blocking_abtest = function(name){
    return blocking_abtest_set.has(name);
  };
  is_nondefault_abtest = function(name){
    return nondefault_abtest_set.has(name);
  };
  out$.get_available_abtest_conditions = get_available_abtest_conditions = function(name){
    return abtest_conditions[name];
  };
  out$.get_abtest_list = get_abtest_list = function(){
    return abtest_list;
  };
  out$.get_abtest_set = get_abtest_set = function(){
    return new Set(abtest_list);
  };
  out$.get_assigned_abtest_conditions = get_assigned_abtest_conditions = async function(){
    var output, abtest_list, i$, len$, abtest, experiment_val;
    output = {};
    abtest_list = get_abtest_list();
    for (i$ = 0, len$ = abtest_list.length; i$ < len$; ++i$) {
      abtest = abtest_list[i$];
      experiment_val = (await getvar_experiment(abtest));
      if (experiment_val == null) {
        continue;
      }
      output[abtest] = experiment_val;
    }
    return output;
  };
  out$.add_abtest = add_abtest = function(name, conditions, func){
    abtest_list.push(name);
    abtest_funcs[name] = func;
    abtest_conditions[name] = conditions;
  };
  out$.set_abtest = set_abtest = async function(name, condition, conditions){
    var abtest_func;
    abtest_func = abtest_funcs[name];
    if (is_blocking_abtest(name)) {
      (await abtest_func(condition));
      if (conditions != null) {
        (await setvar_experiment(name, condition, conditions));
      } else {
        (await setvar_experiment(name, condition));
      }
    } else {
      abtest_func(condition);
      if (conditions != null) {
        setvar_experiment(name, condition, conditions);
      } else {
        setvar_experiment(name, condition);
      }
    }
  };
  out$.run_abtest = run_abtest = async function(name){
    var conditions, condition;
    conditions = abtest_conditions[name];
    condition = conditions[Math.floor(Math.random() * conditions.length)];
    (await set_abtest(name, condition, conditions));
  };
  add_abtest('internal_special_user', ['off'], async function(chosen_algorithm){
    localStorage.setItem('internal_special_user', chosen_algorithm);
  });
  add_abtest('selection_algorithm_for_visit', ['one_random_intervention_per_enabled_goal'], async function(chosen_algorithm){
    localStorage.setItem('selection_algorithm_for_visit', chosen_algorithm);
  });
  add_abtest('intervention_firstimpression_notice', ['power'], async function(chosen_algorithm){
    localStorage.setItem('intervention_firstimpression_notice', chosen_algorithm);
  });
  add_abtest('choose_difficulty_interface', ['this_intervention_toast_v5'], async function(chosen_algorithm){
    localStorage.setItem('choose_difficulty_interface', chosen_algorithm);
  });
  add_abtest('difficulty_selection_screen_and_choose_difficulty_frequency', ['survey', 'nodefault_forcedchoice_userchoice', 'survey_nochoice_nothing', 'survey_nochoice_easy', 'survey_nochoice_medium', 'survey_nochoice_hard'], async function(chosen_algorithm){
    var conditions;
    localStorage.setItem('difficulty_selection_screen_and_choose_difficulty_frequency', chosen_algorithm);
    conditions = ['nodefault_forcedchoice', 'nodefault_forcedchoice_userchoice', 'survey_nochoice_nothing', 'survey_nochoice_easy', 'survey_nochoice_medium', 'survey_nochoice_hard'];
    if (chosen_algorithm === 'survey') {
      (await set_abtest('frequency_of_choose_difficulty', '0.0', ['0.0', 'survey']));
      (await set_abtest('difficulty_selection_screen', 'nodefault_forcedchoice', conditions));
    } else {
      (await set_abtest('frequency_of_choose_difficulty', '0.0', ['0.0', 'survey']));
      (await set_abtest('difficulty_selection_screen', chosen_algorithm, conditions));
    }
  });
  add_abtest('frequency_of_choose_difficulty', ['0.0', 'survey'], async function(chosen_algorithm){
    localStorage.setItem('frequency_of_choose_difficulty', chosen_algorithm);
  });
  add_abtest('difficulty_selection_screen', ['nodefault_forcedchoice', 'nodefault_forcedchoice_userchoice', 'survey_nochoice_nothing', 'survey_nochoice_easy', 'survey_nochoice_medium', 'survey_nochoice_hard'], async function(chosen_algorithm){
    if (chosen_algorithm === 'survey_nochoice_nothing') {
      localStorage.setItem('difficulty_selector_survey', true);
      setvar_experiment('user_chosen_difficulty', 'nothing');
      (await enabledisable_interventions_based_on_difficulty('nothing'));
    }
    if (chosen_algorithm === 'survey_nochoice_easy') {
      localStorage.setItem('difficulty_selector_survey', true);
      setvar_experiment('user_chosen_difficulty', 'easy');
      (await enabledisable_interventions_based_on_difficulty('easy'));
    }
    if (chosen_algorithm === 'survey_nochoice_medium') {
      localStorage.setItem('difficulty_selector_survey', true);
      setvar_experiment('user_chosen_difficulty', 'medium');
      (await enabledisable_interventions_based_on_difficulty('medium'));
    }
    if (chosen_algorithm === 'survey_nochoice_hard') {
      localStorage.setItem('difficulty_selector_survey', true);
      setvar_experiment('user_chosen_difficulty', 'hard');
      (await enabledisable_interventions_based_on_difficulty('hard'));
    }
    if (chosen_algorithm === 'nochoice_nothing') {
      localStorage.setItem('difficulty_selector_disabled', true);
      localStorage.setItem('difficulty_selector_survey', false);
      localStorage.user_chosen_difficulty = 'nothing';
      setvar_experiment('user_chosen_difficulty', 'nothing');
      (await enabledisable_interventions_based_on_difficulty('nothing'));
    }
    if (chosen_algorithm === 'nochoice_easy') {
      localStorage.setItem('difficulty_selector_disabled', true);
      localStorage.setItem('difficulty_selector_survey', false);
      localStorage.user_chosen_difficulty = 'easy';
      setvar_experiment('user_chosen_difficulty', 'easy');
      (await enabledisable_interventions_based_on_difficulty('easy'));
    }
    if (chosen_algorithm === 'nochoice_medium') {
      localStorage.setItem('difficulty_selector_disabled', true);
      localStorage.setItem('difficulty_selector_survey', false);
      localStorage.user_chosen_difficulty = 'medium';
      setvar_experiment('user_chosen_difficulty', 'medium');
      (await enabledisable_interventions_based_on_difficulty('medium'));
    }
    if (chosen_algorithm === 'nochoice_hard') {
      localStorage.setItem('difficulty_selector_disabled', true);
      localStorage.setItem('difficulty_selector_survey', false);
      localStorage.user_chosen_difficulty = 'hard';
      setvar_experiment('user_chosen_difficulty', 'hard');
      (await enabledisable_interventions_based_on_difficulty('hard'));
    }
    if (chosen_algorithm === 'nodefault_optional') {
      localStorage.setItem('difficulty_selector_survey', false);
    }
    if (chosen_algorithm === 'none') {
      localStorage.setItem('difficulty_selector_disabled', true);
      localStorage.setItem('difficulty_selector_survey', false);
    }
    if (chosen_algorithm === 'nodefault_forcedchoice') {
      localStorage.setItem('difficulty_selector_forcedchoice', true);
      localStorage.setItem('difficulty_selector_survey', false);
    }
    if (chosen_algorithm === 'nodefault_forcedchoice_userchoice') {
      localStorage.setItem('difficulty_selector_forcedchoice', true);
      localStorage.setItem('difficulty_selector_survey', false);
      localStorage.setItem('difficulty_selector_userchoice', true);
    }
    localStorage.setItem('difficulty_selection_screen', chosen_algorithm);
  });
  add_abtest('intervention_suggestion_optout', ['off'], async function(chosen_algorithm){
    if (chosen_algorithm === 'off') {
      localStorage.setItem('suggestion_mode_optout', false);
    } else {
      localStorage.setItem('suggestion_mode_optout', true);
    }
  });
  add_abtest('intervention_suggestion_algorithm', ['off'], async function(chosen_algorithm){
    if (chosen_algorithm === 'off') {
      localStorage.setItem('suggest_interventions', false);
    } else {
      localStorage.setItem('suggest_interventions', true);
    }
    localStorage.setItem('intervention_suggestion_algorithm', chosen_algorithm);
  });
  add_abtest('goal_suggestion_threshold', [0], async function(chosen_algorithm){
    localStorage.setItem('goal_suggestion_threshold', chosen_algorithm);
  });
  add_abtest('onboarding_ideavoting_abtest', ['on'], async function(chosen_algorithm){
    if (chosen_algorithm === 'off') {
      localStorage.setItem('idea_voting_disabled', true);
    } else {
      localStorage.setItem('idea_voting_disabled', false);
    }
    localStorage.setItem('onboarding_ideavoting_abtest', chosen_algorithm);
  });
  add_abtest('daily_goal_reminders_abtest', ['off'], async function(chosen_algorithm){
    if (chosen_algorithm === 'off') {
      localStorage.setItem('allow_daily_goal_notifications', false);
      send_feature_disabled({
        page: 'background',
        feature: 'allow_daily_goal_notifications',
        manual: false,
        reason: 'daily_goal_reminders_abtest'
      });
    }
  });
  add_abtest('reward_gifs_abtest', ['off'], async function(chosen_algorithm){
    var algorithms;
    if (chosen_algorithm == null) {
      algorithms = ['off'];
      chosen_algorithm = algorithms[Math.floor(Math.random() * algorithms.length)];
    }
    if (chosen_algorithm === 'off') {
      localStorage.setItem('allow_reward_gifs', false);
      send_feature_disabled({
        page: 'background',
        feature: 'allow_reward_gifs',
        manual: false,
        reason: 'reward_gifs_abtest'
      });
    }
  });
  add_abtest('intervention_intensity_polling_abtest', ['off'], async function(chosen_algorithm){
    if (chosen_algorithm === 'off') {
      localStorage.setItem('intervention_intensity_polling', false);
      send_feature_disabled({
        page: 'background',
        feature: 'intervention_intensity_polling',
        manual: false,
        reason: 'intervention_intensity_polling_abtest'
      });
    } else {
      localStorage.setItem('intervention_intensity_polling', true);
    }
    setvar_experiment('intervention_intensity_polling_abtest', chosen_algorithm);
  });
  add_abtest('allow_nongoal_timer', ['off'], async function(chosen_algorithm){
    if (chosen_algorithm === 'off') {
      localStorage.setItem('allow_nongoal_timer', false);
      send_feature_disabled({
        page: 'background',
        feature: 'allow_nongoal_timer',
        manual: false,
        reason: 'nongoal_timer_abtest'
      });
    }
  });
  add_abtest('idea_contribution_money', ['on'], async function(chosen_algorithm){
    if (chosen_algorithm === 'off') {
      localStorage.setItem('idea_contribution_money', false);
    } else {
      localStorage.setItem('idea_contribution_money', true);
    }
  });
  add_abtest('ideavoting_submit_prompt', ['on'], async function(chosen_algorithm){
    if (chosen_algorithm === 'off') {
      localStorage.setItem('ideavoting_submit_prompt', true);
    } else {
      localStorage.setItem('ideavoting_submit_prompt', false);
    }
  });
  out$.setup_abtest_newuser = setup_abtest_newuser = async function(){
    var i$, ref$, len$, abtest_name;
    for (i$ = 0, len$ = (ref$ = abtest_list).length; i$ < len$; ++i$) {
      abtest_name = ref$[i$];
      if (is_nondefault_abtest(abtest_name)) {
        continue;
      }
      (await run_abtest(abtest_name));
    }
  };
  out$.setup_abtest_olduser = setup_abtest_olduser = async function(){
    if (localStorage.intervention_suggestion_algorithm == null) {
      (await run_abtest('intervention_suggestion_algorithm'));
    }
    if (localStorage.goal_suggestion_threshold == null) {
      (await run_abtest('goal_suggestion_threshold'));
    }
  };
  gexport_module('abtest_utils', function(it){
    return eval(it);
  });
}).call(this);
