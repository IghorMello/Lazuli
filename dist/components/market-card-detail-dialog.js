(function(){
  var ref$, list_all_interventions, get_intervention_info, get_goal_info, polymer_ext;
  ref$ = require('libs_backend/intervention_utils'), list_all_interventions = ref$.list_all_interventions, get_intervention_info = ref$.get_intervention_info;
  get_goal_info = require('libs_backend/goal_utils').get_goal_info;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  polymer_ext({
    is: 'market-card-detail-dialog',
    properties: {
      star_count_5: {
        type: Number,
        value: Math.floor(Math.random() * 100) + 1
      },
      star_count_4: {
        type: Number,
        value: Math.floor(Math.random() * 100) + 1
      },
      star_count_3: {
        type: Number,
        value: Math.floor(Math.random() * 100) + 1
      },
      star_count_2: {
        type: Number,
        value: Math.floor(Math.random() * 100) + 1
      },
      star_count_1: {
        type: Number,
        value: Math.floor(Math.random() * 100) + 1
      },
      star_count_average: {
        type: Number,
        value: Math.floor(Math.random() * 20) + 10
      }
    },
    compute5StarCount: async function(){
      return Math.floor(Math.random() * 100) + 1;
    },
    ready: async function(){
      this.$$('#intervention_info').open();
      this.$$('#bar-5-width').style.width = this.star_count_5 + "%";
      this.$$('#bar-4-width').style.width = this.star_count_4 + "%";
      this.$$('#bar-3-width').style.width = this.star_count_3 + "%";
      this.$$('#bar-2-width').style.width = this.star_count_2 + "%";
      return this.$$('#bar-1-width').style.width = this.star_count_1 + "%";
    },
    intervention_info_dialog: function(){
      return this.$$('#intervention_info').open();
    },
    remove_intervention_card_clicked: async function(){
      var self;
      self = this;
      self.fire('remove_intervention_card', {});
      return this.$$('#intervention_info').close();
    },
    intervention_info_clicked: async function(){
      var self;
      self = this;
      self.fire('intervention_info', {});
      return this.$$('#intervention_info').close();
    }
  });
}).call(this);
