(function(){
  var ref$, polymer_ext, list_polymer_ext_tags_with_info, list_site_info_for_sites_for_which_goals_are_enabled;
  ref$ = require('libs_frontend/polymer_utils'), polymer_ext = ref$.polymer_ext, list_polymer_ext_tags_with_info = ref$.list_polymer_ext_tags_with_info;
  list_site_info_for_sites_for_which_goals_are_enabled = require('libs_backend/goal_utils').list_site_info_for_sites_for_which_goals_are_enabled;
  polymer_ext({
    is: 'dashboard-view-v2',
    properties: {
      site_info_list: {
        type: Array
      },
      isdemo: {
        type: Boolean,
        observer: 'isdemo_changed'
      }
    }
    /*
    buttonAction1: ->
      this.linedata.datasets[0].label = 'a new label'
      this.$$('#linechart').chart.update()
    */,
    isdemo_changed: function(){
      return this.rerender();
    },
    on_goal_changed: function(evt){
      this.rerender();
      this.$$('graph-time-spent-on-goal-sites-daily').ready();
      this.$$('graph-daily-overview').ready();
      this.$$('graph-num-times-interventions-deployed').ready();
      return this.$$('graph-donut-top-sites').ready();
    },
    rerender: async function(){
      var self, site_info_list;
      self = this;
      self.once_available('#graphsOfGoalsTab', function(){
        return self.S('#graphsOfGoalsTab').prop('selected', 0);
      });
      self.once_available('#graphsOfInterventionEffectivenessTab', function(){
        return self.S('#graphsOfInterventionEffectivenessTab').prop('selected', 0);
      });
      site_info_list = (await list_site_info_for_sites_for_which_goals_are_enabled());
      return self.site_info_list = site_info_list;
    }
  }, {
    source: require('libs_frontend/polymer_methods'),
    methods: ['S', 'once_available', 'first_elem']
  });
}).call(this);
