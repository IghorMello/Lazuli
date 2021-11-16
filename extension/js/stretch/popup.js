// popup javascript

chrome.storage.local.get(["enabled", "freq", "type"], function (option) {
  if (option.enabled != null) {
    if (!option.enabled) {
      document.getElementById("checkbox1").checked = false;
    } else {
      document.getElementById("checkbox1").checked = true;
    }
  } else {
    document.getElementById("checkbox1").checked = true;
  }

  if (option.freq != null) {
    if (parseInt(option.freq) == 30) {
      document.getElementById("frequency").firstChild.data =
        "A cada 30 minutos";
    } else if (parseInt(option.freq) == 60) {
      document.getElementById("frequency").firstChild.data = "A cada 1 hora";
    } else {
      document.getElementById("frequency").firstChild.data = "A cada 2 horas";
    }
  } else {
    document.getElementById("frequency").firstChild.data = "A cada 30 minutos";
  }

  if (option.type != null) {
    if (option.type == "upperbody") {
      document.getElementById("type").firstChild.data = "Tronco";
    } else if (option.type == "lowerbody") {
      document.getElementById("type").firstChild.data = "Corpo lento";
    } else if (option.type == "fullbody") {
      document.getElementById("type").firstChild.data = "Corpo completo";
    }
  } else {
    document.getElementById("type").firstChild.data = "Tronco";
  }
});

document.getElementById("checkbox1").onclick = function () {
  if (document.getElementById("checkbox1").checked == false) {
    chrome.storage.local.set({ enabled: false }, function () {
      console.log("Ativado definido como falso.");
    });
  } else {
    chrome.storage.local.set({ enabled: true }, function () {
      console.log("Ativado definido como verdadeiro.");
    });
  }
};

document.getElementById("frequency").onclick = function () {
  if (
    document.getElementById("frequency").firstChild.data == "A cada 2 horas"
  ) {
    chrome.storage.local.set({ freq: 30 }, function () {
      console.log("Defina a frequência para a cada 30 minutos.");
    });
    document.getElementById("frequency").firstChild.data = "A cada 30 minutos";
  } else if (
    document.getElementById("frequency").firstChild.data == "A cada 30 minutos"
  ) {
    chrome.storage.local.set({ freq: 60 }, function () {
      console.log("Defina a frequência para a cada 60 minutos.");
    });
    document.getElementById("frequency").firstChild.data = "A cada 1 hora";
  } else {
    chrome.storage.local.set({ freq: 120 }, function () {
      console.log("Defina a frequência para cada 120 minutos.");
    });
    document.getElementById("frequency").firstChild.data = "A cada 2 horas";
  }
};

document.getElementById("type").onclick = function () {
  if (document.getElementById("type").firstChild.data == "Tronco") {
    chrome.storage.local.set({ type: "lowerbody" }, function () {
      console.log("Defina o tipo para corpo inferior.");
    });
    document.getElementById("type").firstChild.data = "Corpo lento";
  } else if (document.getElementById("type").firstChild.data == "Lower Body") {
    chrome.storage.local.set({ type: "fullbody" }, function () {
      console.log("Defina o tipo para corpo inteiro.");
    });
    document.getElementById("type").firstChild.data = "Corpo todo";
  } else if (document.getElementById("type").firstChild.data == "Corpo todo") {
    chrome.storage.local.set({ type: "upperbody" }, function () {
      console.log("Defina o tipo para parte superior.");
    });
    document.getElementById("type").firstChild.data = "Tronco";
  }
};

document.getElementById("notification").onclick = function () {
  console.log("Chamando openNotification em background.js.");
  var popupUrl = chrome.runtime.getURL("/remind.html");
  chrome.tabs.query({ url: popupUrl }, function (tabs) {
    window.close();
    if (tabs.length > 0) {
      chrome.tabs.remove(tabs[0].id);
    }
    chrome.windows.create({
      url: "remind.html",
      type: "popup",
      width: 1150,
      height: 720,
      top: 20,
      left: 20,
    });
  });
};
