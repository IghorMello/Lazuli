require_component('netflix-stop-autoplay')
const $ = require('jquery')

var end_of_show = null

var stop_autoplay_process = setInterval(function () {
  if (window.intervention_disabled) {
    return
  }
  if ($('a.nf-icon-button.nf-flat-button.no-icon').length > 0) {
    if ($('a.nf-icon-button.nf-flat-button.no-icon')[0].innerText.toLowerCase() != 'skip intro') {
      // arrived at the end of the video, small button style
      console.log('Watch credits button has appeared')
      var watch_credits_button = $('a.nf-icon-button.nf-flat-button.no-icon').first()
      for (let child of watch_credits_button.children()) {
        console.log('simulating click on child')
        console.log(child)
        $(child).click()
      }

      $('a.nf-icon-button.nf-flat-button.no-icon').first().click()
      console.log($('a.nf-icon-button.nf-flat-button.no-icon').first())
      console.log($('a.nf-icon-button.nf-flat-button.no-icon').first().attr('aria-label'))
      console.log('Watch credits button clicked')
      let b = document.querySelector('video')
      b.pause()
      if ($('netflix-stop-autoplay').length == 0) {
        end_of_show = $('<netflix-stop-autoplay>')
        $(document.body).append(end_of_show)
      }
    }
  }

  if ($('.player-postplay').length > 0) {
    console.log('player-postplay div has appeared')
    let a = document.querySelector('video')

    if (a != null) {
      a.click()
      if (a.currentTime < a.duration - 4) {
        console.log('have clicked on the video. should now be maximized')
        setTimeout(function () {
          console.log('pausing video')
          let b = document.querySelector('video')
          if (b != null) {
            b.pause()
          }

          console.log('video should now be paused')

          if ($('netflix-stop-autoplay').length == 0) {
            end_of_show = $('<netflix-stop-autoplay>')
            $(document.body).append(end_of_show)
          }
        }, 500)
      }
    }
  }
}, 1000)

window.on_intervention_disabled = () => {
  clearInterval(stop_autoplay_process)
  if (end_of_show != null) {
    end_of_show.remove()
  }
  document.querySelector('video').play()
}