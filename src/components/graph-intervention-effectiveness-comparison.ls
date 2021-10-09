{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

{
  get_goal_info
} = require 'libs_backend/goal_utils'

{
  get_interventions
  list_enabled_interventions_for_goal
  get_seconds_saved_per_session_for_each_intervention_for_goal
  list_available_interventions_for_goal
} = require 'libs_backend/intervention_utils'

prelude = require 'prelude-ls'

polymer_ext {
  is: 'graph-intervention-effectiveness-comparison'
  properties: {
    goal_name: {
      type: String
      observer: 'goal_name_changed'
    }

    goal_info: {
      type: Object
      observer: 'goal_info_changed'
    }
    
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
  }

  isdemo_changed: (isdemo) ->
    if isdemo
      this.goal_name = 'facebook/spend_less_time'

  goal_name_changed: (goal_name) ->>
    goal_info = await get_goal_info(goal_name)

    if goal_name != this.goal_name
      return

    if this.goal_info? and this.goal_info.name == goal_name
      return

    this.goal_info = goal_name
    await this.set_new_goal_info(goal_info)

  goal_info_changed: (goal_info) ->>
    if this.goal_name == goal_info.name
      return

    this.goal_name = goal_info.name
    await this.set_new_goal_info(goal_info)

  set_new_goal_info: (goal_info) ->>
    self = this
    goal_name = goal_info.name
    all_interventions = await get_interventions()
    #enabled_interventions = await list_enabled_interventions_for_goal(goal_name)
    available_interventions = await list_available_interventions_for_goal(goal_name)
    intervention_to_seconds_saved = await get_seconds_saved_per_session_for_each_intervention_for_goal(goal_name)

    intervention_minutes_saved_and_displayname = []
    for intervention_name in available_interventions
      seconds_saved = intervention_to_seconds_saved[intervention_name]
      if isNaN seconds_saved
        #continue
        seconds_saved = 0

      minutes_saved = seconds_saved / 60

      if minutes_saved < 0
        minutes_saved = 0
      intervention_info = all_interventions[intervention_name]

      if intervention_info?
        intervention_displayname = intervention_info.displayname

      else
        console.error 'unable to find info for ' + intervention_name

      intervention_minutes_saved_and_displayname.push {
        name: intervention_name
        displayname: intervention_displayname
        minutes_saved: minutes_saved
      }
    
    intervention_minutes_saved_and_displayname = prelude.sortBy (-> -it.minutes_saved), intervention_minutes_saved_and_displayname
    minutes_saved_list = intervention_minutes_saved_and_displayname.map (.minutes_saved)
    intervention_displayname_list = intervention_minutes_saved_and_displayname.map (.displayname)

    if goal_name != this.goal_name
      return
    
    self.goal_info = goal_info
    #displays onto the graph

    self.interventionFreqData = {
      #labels: seenInterventionsLabels
      labels: intervention_displayname_list
      datasets: [
        {
          label: "Minutos economizados por visita (média)",
          backgroundColor: "rgba(65,131,215,0.5)",
          borderColor: "rgba(65,131,215,1)",
          borderWidth: 1,
          data: minutes_saved_list
        }
      ]
    }

    self.interventionFreqOptions = {
      legend: {
        display: false
      }

      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Minutos economizados por visita (média)'
          },
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
}