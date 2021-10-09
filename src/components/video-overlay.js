const {
  get_seconds_spent_on_domain_today
} = require('libs_common/time_spent_utils')

const {
  get_intervention,
  get_goal_info,
} = require('libs_common/intervention_info')

Polymer({
  is: 'video-overlay',

  properties: {
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    },

    domain: {
      type: String,
      value: (function () {
        if (window.location.protocol == 'chrome-extension:')
          return 'www.iqiyi.com'
        else
          return window.location.host
      })()
    },

    sitename_printable: {
      type: String,
      value: get_goal_info().sitename_printable
    }
  },

  watch_button_clicked: function (evt) {
    this.fire('watch_clicked', {})
    console.log('botão de relógio foi clicado')
  },

  ready: async function () {
    const secondsSpent = await get_seconds_spent_on_domain_today(this.domain)
    const mins = Math.floor(secondsSpent / 60)
    const secs = secondsSpent % 60
    this.$.msg.innerHTML = "Você gastou " + mins + " minutos e " + secs + " segundos " + this.sitename_printable + " hoje. <br> Tem certeza que deseja continuar assistindo os vídeos? "
  },

  isdemo_changed: function (isdemo) {
    console.log('isdemo_changed called')
    console.log(isdemo)

    if (isdemo) {
      this.style.height = '410px';
      this.style.width = '680px';
    }
  }
})