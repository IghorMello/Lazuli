{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  get_enabled_goals
  get_goals
} = require 'libs_backend/goal_utils'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  getdict_for_key2_dictdict
  setdict_for_key2_dictdict
  getdict_for_key_dictdict
  getCollection
  setdict
  getdict
  getkey_dict
  setkey_dict
  getkey_dictdict
  setkey_dictdict
} = require 'libs_backend/db_utils'

{
  as_array
  as_dictset
} = require 'libs_common/collection_utils'

{
  get_intervention_selection_algorithm_for_visit
} = require 'libs_backend/intervention_selection_algorithms'

{
  add_log_interventions
} = require 'libs_backend/log_utils'

/*
export set_enabled_interventions_for_today_manual = (enabled_interventions) ->>
  await setdict_for_key2_dictdict 'interventions_enabled_each_day', get_days_since_epoch(), enabled_interventions
  return

export set_enabled_interventions_for_today_automatic = (enabled_interventions) ->>
  await setdict_for_key2_dictdict 'interventions_enabled_each_day', get_days_since_epoch(), enabled_interventions
  return

export get_cached_enabled_interventions_for_today = ->>
  await get_cached_enabled_interventions_for_days_before_today 0

export get_cached_enabled_interventions_for_days_before_today = (days_before_today) ->>
  await getdict_for_key2_dictdict 'interventions_enabled_each_day', (get_days_since_epoch() - days_before_today)

export get_enabled_interventions_for_today = ->>
  await get_enabled_interventions_for_days_before_today 0
*/

export get_active_interventions_for_domain_and_session = (domain, session_id) ->>
  result = await getkey_dictdict 'interventions_active_for_domain_and_session', domain, session_id
  if not result?
    return []
  return JSON.parse result

export set_active_interventions_for_domain_and_session = (domain, session_id, interventions) ->>
  await setkey_dictdict 'interventions_active_for_domain_and_session', domain, session_id, JSON.stringify(interventions)

export get_enabled_interventions_for_visit = ->>
  enabled_interventions = {}
  intervention_selection_algorithm = await get_intervention_selection_algorithm_for_visit()
  selected_interventions_list = await intervention_selection_algorithm()
  selected_interventions_set = {[k, true] for k in selected_interventions_list}
  return selected_interventions_set

/*
export get_enabled_interventions_for_visit = ->>
  enabled_interventions = {}
  intervention_selection_algorithm = await get_intervention_selection_algorithm_for_visit()
  automatically_enabled_interventions_list = await intervention_selection_algorithm()
  automatically_enabled_interventions_set = {[k, true] for k in automatically_enabled_interventions_list}
  enabled_interventions_set = await get_most_recent_enabled_interventions()
  manually_managed_interventions_set = await intervention_utils.get_manually_managed_interventions_localstorage()
  all_interventions = await intervention_utils.list_all_interventions()
  for intervention in all_interventions
    manually_managed = manually_managed_interventions_set[intervention]
    manually_managed = (manually_managed == true)
    enabled = false
    if manually_managed
      enabled = enabled_interventions_set[intervention]
    else
      enabled = automatically_enabled_interventions_set[intervention]
    enabled = (enabled == true)
    enabled_interventions[intervention] = enabled
  return enabled_interventions
*/

get_last_day_with_intervention_enabled_data = ->>
  collection = await getCollection('interventions_enabled_each_day')
  last_intervention_set_item = await collection.orderBy('key2').last()
  if not last_intervention_set_item?
    return
  return last_intervention_set_item.key2 # this is the day, in epoch time, that the most recent intervention set occurred

export get_days_before_today_on_which_intervention_was_deployed = (intervention_name) ->>
  # output is days since today (0 = today, 1 = yesterday)
  days_deployed = await get_days_on_which_intervention_was_deployed intervention_name
  today = get_days_since_epoch()
  return [today - x for x in days_deployed]

export get_days_on_which_intervention_was_deployed = (intervention_name) ->>
  # output is epoch days
  day_to_enabled = await getdict_for_key_dictdict 'interventions_enabled_each_day', intervention_name
  output = []
  for day,enabled of day_to_enabled
    if enabled
      output.push day
  return output

export get_currently_enabled_interventions = ->>
  interventions_currently_disabled = await getdict 'interventions_currently_disabled'
  all_interventions = await intervention_utils.list_all_interventions()
  intervention_name_to_info = await intervention_utils.get_interventions()
  output = {}
  for intervention_name in all_interventions
    intervention_info = intervention_name_to_info[intervention_name]
    if not intervention_info?
      output[intervention_name] = false
      continue
    disable_status = interventions_currently_disabled[intervention_name]
    if disable_status?
      if disable_status
        output[intervention_name] = false
      else
        output[intervention_name] = true
    else
      if not intervention_info.is_default?
        output[intervention_name] = false
      else
        output[intervention_name] = intervention_info.is_default
  return output

export set_currently_enabled_interventions_manual = (enabled_interventions) ->>
  disabled_interventions = {}
  all_interventions = await intervention_utils.list_all_interventions()
  for intervention_name in all_interventions
    if enabled_interventions[intervention_name]
      disabled_interventions[intervention_name] = false
    else
      disabled_interventions[intervention_name] = true
  await setdict 'interventions_currently_disabled', disabled_interventions
  return

export set_intervention_enabled_from_intervention_manager = (intervention_name) ->>
  await setkey_dict 'interventions_currently_disabled', intervention_name, false
  return

export set_intervention_disabled_from_intervention_manager = (intervention_name) ->>
  await setkey_dict 'interventions_currently_disabled', intervention_name, true
  return

export get_is_intervention_disabled_from_intervention_manager = (intervention_name) ->>
  return await getkey_dict 'interventions_currently_disabled', intervention_name

export set_currently_enabled_interventions_automatic = (enabled_interventions) ->>
  disabled_interventions = {}
  all_interventions = await intervention_utils.list_all_interventions()
  for intervention_name in all_interventions
    if enabled_interventions[intervention_name]
      disabled_interventions[intervention_name] = false
    else
      disabled_interventions[intervention_name] = true
  await setdict 'interventions_currently_disabled', disabled_interventions
  return

/*
export get_most_recent_enabled_interventions = ->>
  day_with_enabled_interventions = await get_last_day_with_intervention_enabled_data()
  if not day_with_enabled_interventions?
    return {}
  days_before_today = get_days_since_epoch() - day_with_enabled_interventions
  await get_cached_enabled_interventions_for_days_before_today days_before_today
*/

/*
get_new_enabled_interventions_for_today = ->>
  enabled_interventions = {}
  intervention_selection_algorithm = await get_intervention_selection_algorithm()
  automatically_enabled_interventions_list = await intervention_selection_algorithm()
  automatically_enabled_interventions_set = {[k, true] for k in automatically_enabled_interventions_list}
  enabled_interventions_set = await get_most_recent_enabled_interventions()
  manually_managed_interventions_set = await intervention_utils.get_manually_managed_interventions_localstorage()
  all_interventions = await intervention_utils.list_all_interventions()
  for intervention in all_interventions
    manually_managed = manually_managed_interventions_set[intervention]
    manually_managed = (manually_managed == true)
    enabled = false
    if manually_managed
      enabled = enabled_interventions_set[intervention]
    else
      enabled = automatically_enabled_interventions_set[intervention]
    enabled = (enabled == true)
    enabled_interventions[intervention] = enabled
  return enabled_interventions
*/

/*
export get_and_set_new_enabled_interventions_for_today = ->>
  console.log 'picking new interventions for today'
  prev_enabled_interventions = await get_most_recent_enabled_interventions()
  enabled_interventions = await get_new_enabled_interventions_for_today()
  await set_enabled_interventions_for_today_automatic enabled_interventions
  add_log_interventions {
    type: 'new_interventions_for_new_day'
    manual: false
    prev_enabled_interventions: prev_enabled_interventions
    enabled_interventions: enabled_interventions
  }
  return enabled_interventions
*/

/*
export get_enabled_interventions_for_days_before_today = (days_before_today) ->>
  cached_enabled_interventions = await get_cached_enabled_interventions_for_days_before_today days_before_today
  if Object.keys(cached_enabled_interventions).length != 0
    return cached_enabled_interventions
  if days_before_today > 0 # no interventions were enabled in the past
    return {}
  enabled_interventions = await get_and_set_new_enabled_interventions_for_today()
  return enabled_interventions
*/

/*
export enable_interventions_because_goal_was_enabled = (goal_name) ->>
  intervention_selection_algorithm = await get_intervention_selection_algorithm()
  enabled_goals_for_selection_algorithm = {}
  enabled_goals_for_selection_algorithm[goal_name] = true
  automatically_enabled_interventions_list = await intervention_selection_algorithm(enabled_goals_for_selection_algorithm)
  console.log 'automatically_enabled_interventions_list is'
  console.log automatically_enabled_interventions_list
  enabled_interventions = await intervention_utils.get_enabled_interventions()
  prev_enabled_interventions = {} <<< enabled_interventions
  newly_enabled_interventions = []
  for intervention_name in automatically_enabled_interventions_list
    if enabled_interventions[intervention_name]
      continue
    newly_enabled_interventions.push intervention_name
    enabled_interventions[intervention_name] = true
  await set_enabled_interventions_for_today_automatic enabled_interventions
  add_log_interventions {
    type: 'enable_interventions_because_goal_was_enabled'
    manual: false
    goal_enabled: goal_name
    prev_enabled_interventions: prev_enabled_interventions
    enabled_interventions: enabled_interventions
  }
  return newly_enabled_interventions
*/

export enable_interventions_because_goal_was_enabled = (goal_name) ->>
  intervention_names = await intervention_utils.list_available_interventions_for_goal(goal_name)
  enabled_interventions = await get_currently_enabled_interventions()
  prev_enabled_interventions = JSON.parse JSON.stringify enabled_interventions
  intervention_name_to_info = await intervention_utils.get_interventions()
  for intervention_name in intervention_names
    if enabled_interventions[intervention_name]?
      continue
    intervention_info = intervention_name_to_info[intervention_name]
    if intervention_info.is_default
      enabled_interventions[intervention_name] = true
    else
      enabled_interventions[intervention_name] = false
  await set_currently_enabled_interventions_automatic(enabled_interventions)
  add_log_interventions {
    type: 'enable_interventions_because_goal_was_enabled'
    manual: false
    goal_enabled: goal_name
    prev_enabled_interventions: prev_enabled_interventions
    enabled_interventions: enabled_interventions
  }
  return enabled_interventions

intervention_utils = require 'libs_backend/intervention_utils'

gexport_module 'intervention_manager', -> eval(it)
