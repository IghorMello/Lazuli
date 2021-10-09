const {
  wrap_in_shadow
} = require('libs_frontend/frontend_libs')

var $ = require('jquery');

require_component('paper-button')
require_component('lazuli-logo-v2')

//Removes recommendations (modified from 'remove_news_feed' src code)
function removeRec() {
  $('#sims-consolidated-2_feature_div').css('opacity', 0);
  $('#sims-consolidated-1_feature_div').css('opacity', 0);
  $('.copilot-secure-display').css('opacity', 0);
  $('#recommendations_feature_div').css('opacity', 0);
  $('#hero-quick-promo').css('opacity', 0);
}

//shows recommendations
function showRec() {
  $('#lazuli_show_rec_div').remove()
  $('#sims-consolidated-2_feature_div').css('opacity', 1);
  $('#sims-consolidated-1_feature_div').css('opacity', 1);
  $('.copilot-secure-display').css('opacity', 1);
  $('#recommendations_feature_div').css('opacity', 1);
  $('#hero-quick-promo').css('opacity', 1);
}

//attaches buttons for user to choose to show recommendations
function attachButtons() {
  var lazuli_show_rec_div = $('<div>').css('display', 'flex')
  var show_comments_button = $('<paper-button style="background-color: #415D67; color: white; width: 152 px; height: 38px; -webkit-font-smoothing: antialiased; box-shadow: 2px 2px 2px #888888; font-size: 12px;">Show Recommendations</paper-button>')
  var lazuli_logo = $('<lazuli-logo-v2 style="font-size: 12px; margin-left: 5px"></lazuli-logo-v2>')
  //var cheatButton = $('<button>').text('Show my recommendations').css({
  //  'text-align': 'center' 
  //}) // lazuli_show_rec_div.createElement("BUTTON");
  /*
  var t = lazuli_show_rec_div.createTextNode("Show my recommendations");
  lazuli_show_rec_div.css({
    'text-align': 'center'
  })
  */
  //cheatButton.appendChild(t);
  //lazuli_show_rec_div.body.appendChild(cheatButton);
  lazuli_show_rec_div.append([
    show_comments_button,
    lazuli_logo
  ])
  $('body').append($(wrap_in_shadow(lazuli_show_rec_div)).attr('id', 'lazuli_show_rec_div'))
  show_comments_button.on('click', function () {
    showRec();
  });
  lazuli_show_rec_div.offset($('#sims-consolidated-1_feature_div').offset());
}



removeRec();
attachButtons();

window.on_intervention_disabled = () => {
  showRec();
}

