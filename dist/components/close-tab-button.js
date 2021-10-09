(function(){
  var close_selected_tab, log_action, get_tab_id, close_tab_with_id, msg;
  close_selected_tab = require('libs_common/tab_utils').close_selected_tab;
  log_action = require('libs_frontend/intervention_log_utils').log_action;
  get_tab_id = require('libs_common/intervention_info').get_tab_id;
  close_tab_with_id = require('libs_common/tab_utils').close_tab_with_id;
  msg = require('libs_common/localization_utils').msg;
  Polymer({
    is: 'close-tab-button',
    doc: 'Um botão que fecha a guia atual',
    properties: {
      buttontext: {
        type: String,
        value: msg('Fechar aba')
      }
    },
    button_clicked: async function(){
      (await log_action({
        'positive': 'close-tab-button clicked'
      }));
      return close_tab_with_id(get_tab_id());
    }
  });
}).call(this);
