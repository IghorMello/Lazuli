function audioNotification(notificationSound) {
  console.log("notificação de som aprovado: " + notificationSound);
  var sound = new Audio('audio/' + notificationSound + '.mp3');
  sound.play();
}

function show() {
  var time = /(..)(:..)/.exec(new Date());
  var hour = time[1] % 12 || 12;
  var period = time[1] < 12 ? 'a.m.' : 'p.m.';
  var message;
  var notificationSound;

  chrome.storage.sync.get(['message', 'sound'], function (items) {
    message = items.message;
    notificationSound = items.sound;

    if (message == "") {
      message = 'Oi amigo. É hora de beber um pouco de ÁGUA.'
    }

    new Notification(hour + time[2] + ' ' + period, {
      icon: './images/icon.png',
      body: message
    });

    console.log("localStorage.isSoundActivated : " + JSON.parse(localStorage.isSoundActivated));

    if (JSON.parse(localStorage.isSoundActivated)) {
      audioNotification(notificationSound);
    }
  });
}

if (!localStorage.isInitialized) {
  localStorage.isActivated = true;
  localStorage.frequency = 1;
  localStorage.isInitialized = true;
  localStorage.isSoundActivated = true;
  var goal = 10;
  var message = "Olá amigo, parece que é hora de beber um pouco de água.";
  var sound = "Bubble";
  var total = 0;

  chrome.storage.sync.set({ 'goal': goal, 'message': message, 'sound': sound, 'total': total }, function () {
    var opt = {
      type: "basic",
      title: "Obrigado por fazer o download. Vamos te manter hidratado.",
      message: "Clique com o botão direito no ícone na parte superior e selecione as opções para alterar as configurações.",
      iconUrl: "images/icon.png"
    }
    chrome.notifications.create('saveChanges', opt, function () { });
  });

}

if (window.Notification) {
  if (JSON.parse(localStorage.isActivated)) { show(); }
  var interval = 0;
  setInterval(function () {
    interval++;
    if (
      JSON.parse(localStorage.isActivated) &&
      localStorage.frequency <= interval
    ) {
      show();
      interval = 0;
    }
  }, 60000);
}