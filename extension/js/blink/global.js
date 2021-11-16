//================================================================================
// Defining default values
//================================================================================

// Default notification values
const defaultBlinkValue = 20;
const defaultWaterValue = 45;
const defaultStretchValue = 90;
const defaultPostureValue = 20;

const defaultNotificationValueMultiplier = 60 * 1000; // minutes

// Other default settings
const defaultRunning = true;
const defaultPlaySound = false;
const notificationSound = new Audio("notification-sound.mp3");

const notificationQueueDelay = 5100; // 2 seconds
const notificationDispatcherInterval = 5300; // Time adjustment for setInterval()

//================================================================================
// Defining setting variables that will be modified depending on the
// development environment, or according to user preferences
//================================================================================

var notificationValueMultiplier = defaultNotificationValueMultiplier;

var waterInterval = defaultWaterValue * notificationValueMultiplier;
var blinkInterval = defaultBlinkValue * notificationValueMultiplier;
var stretchInterval = defaultStretchValue * notificationValueMultiplier;
var postureInterval = defaultPostureValue * notificationValueMultiplier;

var waterScheduler;
var blinkScheduler;
var stretchScheduler;
var postureScheduler;

var running = defaultRunning;
var playSound = defaultPlaySound;

var developmentEnvironment = false;

//================================================================================
// Defining notification objects
//================================================================================

var waterNotification = {
  id: "water",
  type: "basic",
  title: "Take a sip",
  message: "It's time to drink some water.",
  iconUrl: "images/water.png",
};

var blinkNotification = {
  id: "blink",
  type: "basic",
  title: "Blink your eyes",
  message:
    "Blink your eyes 10 times, then focus in the distance for a couple of seconds.",
  iconUrl: "images/eye.png",
};

var stretchNotification = {
  id: "stretch",
  type: "basic",
  title: "Time to stretch",
  message:
    "Get up and stretch, go to the kitchen or to the bathroom or to the balcony.",
  iconUrl: "images/stretch.png",
};

var postureNotification = {
  id: "posture",
  type: "basic",
  title: "Are you sitting correctly?",
  message:
    "Push your hips as far back as you can. Keep your shoulders back and your back straight.",
  iconUrl: "images/posture.png",
};

//================================================================================
// Notification Queue & Dispatcher
//================================================================================

var notificationQueue = [];
var lastNotificationTimestamp = Date.now();

var notificationDispatcher = function () {
  const currentTimestamp = Date.now();

  if (
    notificationQueue.length > 0 &&
    currentTimestamp - lastNotificationTimestamp >= notificationQueueDelay
  ) {
    config = notificationQueue.shift();
    if (running) {
      displayNotification(config);
    }
    lastNotificationTimestamp = Date.now();
  }
};

//================================================================================
// Defining helper functions
//================================================================================

var displayNotification = function (notificationConfig) {
  id = notificationConfig.id;

  chromeNotification = {};
  chromeNotification.type = notificationConfig.type;
  chromeNotification.title = notificationConfig.title;
  chromeNotification.message = notificationConfig.message;
  chromeNotification.iconUrl = notificationConfig.iconUrl;

  chrome.notifications.create(id + Math.random(), chromeNotification); // Random is used for OSX

  if (playSound) {
    notificationSound.play();
  }
};

var addNotificationToQueue = function (notificationConfig) {
  notificationQueue.push(notificationConfig);
};

var notificationScheduler = function () {
  notificationQueue = [];

  clearInterval(waterScheduler);
  clearInterval(blinkScheduler);
  clearInterval(stretchScheduler);
  clearInterval(postureScheduler);

  if (!running) return;

  if (waterInterval) {
    waterScheduler = setInterval(function () {
      addNotificationToQueue(waterNotification);
    }, waterInterval);
  }

  if (blinkInterval) {
    blinkScheduler = setInterval(function () {
      addNotificationToQueue(blinkNotification);
    }, blinkInterval);
  }

  if (stretchInterval) {
    stretchScheduler = setInterval(function () {
      addNotificationToQueue(stretchNotification);
    }, stretchInterval);
  }

  if (postureInterval) {
    postureScheduler = setInterval(function () {
      addNotificationToQueue(postureNotification);
    }, postureInterval);
  }
};

var refreshScheduler = function () {
  chrome.storage.sync.get("healthyBrowsingSettings", function (storagePrefs) {
    prefs = buildPrefsFromStorage(storagePrefs);

    blinkInterval = prefs.blinkValue * notificationValueMultiplier;
    stretchInterval = prefs.stretchValue * notificationValueMultiplier;
    waterInterval = prefs.waterValue * notificationValueMultiplier;
    postureInterval = prefs.postureValue * notificationValueMultiplier;
    running = prefs.running;
    playSound = prefs.playSound;

    notificationScheduler();
  });
};

var receiveMessage = function (message, sender, sendResponse) {
  if (message.action == "optionsChanged") {
    refreshScheduler();
  } else if (message.action == "testNotifications") {
    addNotificationToQueue(waterNotification);
    addNotificationToQueue(blinkNotification);
    addNotificationToQueue(stretchNotification);
    addNotificationToQueue(postureNotification);
  }
};

var buildPrefsFromStorage = function (storagePrefs) {
  prefs = storagePrefs.healthyBrowsingSettings;

  if (prefs == null) {
    prefs = {};
  }
  if (prefs.blinkValue == null) {
    prefs.blinkValue = defaultBlinkValue;
  }
  if (prefs.stretchValue == null) {
    prefs.stretchValue = defaultStretchValue;
  }
  if (prefs.waterValue == null) {
    prefs.waterValue = defaultWaterValue;
  }
  if (prefs.postureValue == null) {
    prefs.postureValue = defaultPostureValue;
  }
  if (prefs.running == null) {
    prefs.running = defaultRunning;
  }
  if (prefs.playSound == null) {
    prefs.playSound = defaultPlaySound;
  }

  return prefs;
};

//================================================================================
// Execute code in background
//================================================================================

chrome.management.getSelf((extensionInfo) => {
  console.log(JSON.stringify(extensionInfo));
  installType = extensionInfo.installType;

  if (installType == "development") {
    console.log("Loading Development Config");
    notificationValueMultiplier = 1000; // Use seconds for development
    developmentEnvironment = true;
  }
});
