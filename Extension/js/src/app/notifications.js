const toggle = {
  status: true,
};
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const myDelay = async (interval) => {
  console.log("waiting!");
  await delay(interval);
  console.log("waiting!");
  return;
};

const notification = async () => {
  const interval = 36000;
  while (toggle.status) {
    await myDelay(interval);
    if (toggle.status == false) {
      break;
    }
    const notification = new Notification("New message incoming", {
      body: "Ei! É hora de beber um pouco de água, estique as costas e descanse os olhos. \nLembre-se de manter as costas retas.",
    });
    notification.onclick = (e) => {
      window.location.href = "views/settings.html";
    };
  }
};

notification();

chrome.browserAction.onClicked.addListener(function (tab) {
  switchToggle(toggle);
});
