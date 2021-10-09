const {
  get_seconds_spent_on_current_domain_today
} = require('libs_common/time_spent_utils')

const {
  printable_time_spent
} = require('libs_common/time_utils')

const {
  close_current_tab
} = require('libs_frontend/intervention_close_tab')

const {
  log_action
} = require('libs_frontend/intervention_log_utils')

const {
  make_notification,
  notification_onclick,
  close_notification
} = require('libs_frontend/notification_utils')

function shouldInsert(secondsSpent, timeInterval) {
  const newestInterval = Math.floor(Math.floor(secondsSpent / 60) / timeInterval)

  if (!localStorage.hasOwnProperty("currInterval")) {
    localStorage.currInterval = newestInterval
    return true
  } else { //property already exists in storage
    //A new day
    if (newestInterval < parseInt(localStorage.currInterval, 10)) {
      localStorage.currInterval = newestInterval
      return true
    } else if (newestInterval === parseInt(localStorage.currInterval, 10)) {
      return false
    } else { //newestInterval > localStorage.currInterval
      localStorage.currInterval = newestInterval;
      return true
    }
  }
}

function insertRichNotification() {
  get_seconds_spent_on_current_domain_today().then(async function (secondsSpent) {
    var timeSpent = printable_time_spent(secondsSpent)
    var notification_id = await make_notification({
      title: 'Lazuli',
      icon: chrome.extension.getURL('icons/icon_128.png'),
      body: "Você gastou " + timeSpent + " no Facebook hoje."
    });

    notification_onclick(notification_id, function () {
      log_action({ 'positive': 'Usuário fechou o Facebook.' })
      close_notification(notification_id);
      close_current_tab();
    })
  })
}

function main() {
  insertRichNotification();
}

main()