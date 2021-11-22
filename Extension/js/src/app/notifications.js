function notifyMe() {
  if (!("Notification" in window)) {
    alert("This browser does not support system notifications");
  } else if (Notification.permission === "granted") {
    notify();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        notify();
      }
    });
  }

  function playSound() {
    const audio = new Audio("../assets/audio/notification.mp3");
    audio.play();
  }

  function notify() {
    playSound();
    var notification = new Notification("Lembrete para ajustar a postura", {
      icon: "../assets/img/posture.png",
      body: "Hey! Lembre-se de ajustar sua postura e manter as costas retas!",
    });

    notification.onclick = function () {
      window.open("../views/settings.html");
    };
    setTimeout(notification.close.bind(notification), 7000);
  }
}
notifyMe();
