const $ = require('jquery')

const {
  once_available
} = require('libs_frontend/frontend_libs')

require_component('lazuli-logo-v2')

//Polymer button
require_component('paper-button')

var intervalID = window.setInterval(removeFeed, 200);

function removeFeed() {
  var re = new RegExp('twitter.com\/\??.*$')
  if (!re.test(window.location.href)) {
    return
  }
  var timelineFeed = $('.content-main.top-timeline-tweetbox').find('.stream-items.js-navigable-stream')
  timelineFeed.hide()
  var spinner = $('.stream-end-inner')
  spinner.hide()
}

function showFeed() {
  clearInterval(intervalID) //stop refreshing the page to hide elements  
  $('#lazuli_container').remove()

  var timelineFeed = $('.content-main.top-timeline-tweetbox').find('.stream-items.js-navigable-stream')
  timelineFeed.show()
  $('.stream-end-inner').show()
}

var container = $('<div style="text-align: center;" id="lazuli_container"></div>')
var lazuli_logo = $('<lazuli-logo-v2></lazuli-logo-v2>')
var cheatButton = $('<paper-button style="color: white; background-color: #415D67; box-shadow: 2px 2px 2px #888888;" raised>Mostrar meu feed uma vez</paper - button ></center > ')
container.append([cheatButton, '<br><br>', lazuli_logo])
cheatButton.click(function () {
  showFeed()
})

$('.content-main.top-timeline-tweetbox').append(container)

window.on_intervention_disabled = () => {
  showFeed()
}
