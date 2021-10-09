{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

{
  get_num_impressions_today
  get_num_actions_today
  get_interventions_seen_today
} = require 'libs_backend/log_utils'

{
  get_interventions
} = require 'libs_backend/intervention_utils'

polymer_ext {
  is: 'graph-num-times-interventions-deployed'
  properties: {
  }
  ready: ->>
    self = this
    
    #MARK: Num Times Nudges Deployed Graph
    #Retrieves all interventions    
    seenInterventions = await get_interventions_seen_today()

    results = []
    for intv in seenInterventions
      results.push await get_num_impressions_today(intv)

    #Retrieves all intervention descriptions
    interv_descriptions = await get_interventions()

    #Retrieves necessary intervention descriptions
    seenInterventionsLabels = []
    for item in seenInterventions
      seenInterventionsLabels.push(interv_descriptions[item].description)      

    #displays onto the graph
    self.interventionFreqData = {
      labels: seenInterventionsLabels
      datasets: [
        {
          label: "Times Deployed",
          backgroundColor: "rgba(65,131,215,0.5)",
          borderColor: "rgba(65,131,215,1)",
          borderWidth: 1,
          data: results
        }
      ]
    }

    self.interventionFreqOptions = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number of Times'
          },
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
