/* livescript */

var polymer_ext, get_minutes_saved_to_badges, get_intervention;
polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
get_minutes_saved_to_badges = require('libs_common/badges_utils').get_minutes_saved_to_badges;
get_intervention = require('libs_common/intervention_info').get_intervention;
polymer_ext({
  is: 'badge-display-mini',
  docs: 'Um padrão para emblemas ganhos por meio do Lazuli',
  properties: {
    minutes_saved: {
      type: Number
    },
    badge_details: {
      type: Object,
      computed: 'compute_badge_details(minutes_saved)'
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    }
  },
  isdemo_changed: function(isdemo){
    if (isdemo) {
      return this.minutes_saved = 15;
    }
  },
  compute_badge_details: function(minutes_saved){
    var minutes_saved_to_badges;
    minutes_saved_to_badges = get_minutes_saved_to_badges();
    return minutes_saved_to_badges[minutes_saved];
  },
  play: function(){}
});