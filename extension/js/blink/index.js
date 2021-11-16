//================================================================================
// UI Elements
//================================================================================

var blinkSliderId = "#blink_slider";
var waterSliderId = "#water_slider";
var stretchSliderId = "#stretch_slider";
var postureSliderId = "#posture_slider";

var runningToggleButton = "#toggle-running";
var playSoundToggleButton = "#toggle-sound";
var toggleButtonSelected = "toggle-button-selected";

var resetSettingsButton = "#reset-settings";

var testNotificationsButton = "#test-notifications";

//================================================================================
// Helper Functions
//================================================================================

function getSliderText(value) {
  if (typeof value == undefined) return "Error";
  if (value == 0) return "Disabled";
  return value + " minutes";
}

var updateBlinkText = function (value) {
  $("#blink_value").html(value);
};
var updateWaterText = function (value) {
  $("#water_value").html(value);
};
var updateStretchText = function (value) {
  $("#stretch_value").html(value);
};
var updatePostureText = function (value) {
  $("#posture_value").html(value);
};

var getUserPrefsFromUI = function () {
  var prefs = {};
  prefs.blinkValue = $(blinkSliderId).slider("value");
  prefs.waterValue = $(waterSliderId).slider("value");
  prefs.stretchValue = $(stretchSliderId).slider("value");
  prefs.postureValue = $(postureSliderId).slider("value");
  prefs.running = running;
  prefs.playSound = playSound;
  return prefs;
};

var storeUserPrefs = function () {
  chrome.storage.sync.set(
    { healthyBrowsingSettings: getUserPrefsFromUI() },
    function () {
      chrome.extension.sendMessage({ action: "optionsChanged" });
    }
  );
};

//================================================================================
// UI Handlers
//================================================================================

var resetDefaultSettings = function () {
  $(blinkSliderId).slider("value", defaultBlinkValue);
  $(waterSliderId).slider("value", defaultWaterValue);
  $(stretchSliderId).slider("value", defaultStretchValue);
  $(postureSliderId).slider("value", defaultPostureValue);

  updateBlinkText(getSliderText(defaultBlinkValue));
  updateWaterText(getSliderText(defaultWaterValue));
  updateStretchText(getSliderText(defaultStretchValue));
  updatePostureText(getSliderText(defaultPostureValue));

  storeUserPrefs();
};

//================================================================================
// Execute code and assign handlers
//================================================================================

$(document).ready(function () {
  chrome.storage.sync.get("healthyBrowsingSettings", function (storagePrefs) {
    prefs = buildPrefsFromStorage(storagePrefs);

    running = prefs.running;
    playSound = prefs.playSound;

    updateBlinkText(getSliderText(prefs.blinkValue));
    updateWaterText(getSliderText(prefs.waterValue));
    updateStretchText(getSliderText(prefs.stretchValue));
    updatePostureText(getSliderText(prefs.postureValue));

    var sliderOptions = {
      step: 5,
      min: 0,
      max: 120,
      value: 10,
    };

    var blinkSliderOptions = sliderOptions;
    blinkSliderOptions.value = prefs.blinkValue;
    blinkSliderOptions.change = storeUserPrefs;
    blinkSliderOptions.slide = function (event, ui) {
      updateBlinkText(getSliderText(ui.value));
    };
    $(blinkSliderId).slider(blinkSliderOptions);

    var waterSliderOptions = sliderOptions;
    waterSliderOptions.value = prefs.waterValue;
    waterSliderOptions.change = storeUserPrefs;
    waterSliderOptions.slide = function (event, ui) {
      updateWaterText(getSliderText(ui.value));
    };
    $(waterSliderId).slider(waterSliderOptions);

    var stretchSliderOptions = sliderOptions;
    stretchSliderOptions.value = prefs.stretchValue;
    stretchSliderOptions.change = storeUserPrefs;
    stretchSliderOptions.slide = function (event, ui) {
      updateStretchText(getSliderText(ui.value));
    };
    $(stretchSliderId).slider(stretchSliderOptions);

    var postureSliderOptions = sliderOptions;
    postureSliderOptions.value = prefs.postureValue;
    postureSliderOptions.change = storeUserPrefs;
    postureSliderOptions.slide = function (event, ui) {
      updatePostureText(getSliderText(ui.value));
    };
    $(postureSliderId).slider(postureSliderOptions);

    if (running) {
      $(runningToggleButton).toggleClass(toggleButtonSelected);
    }

    if (playSound) {
      $(playSoundToggleButton).toggleClass(toggleButtonSelected);
    }
  });

  // Display the test notifications button if in development mode
  if (developmentEnvironment) {
    $(testNotificationsButton).append("<button>test notifications</button>");
  }
});

$(document).on("click", runningToggleButton, function () {
  running = !running;
  storeUserPrefs();
  $(this).toggleClass(toggleButtonSelected);
});

$(document).on("click", playSoundToggleButton, function () {
  playSound = !playSound;
  storeUserPrefs();
  $(this).toggleClass(toggleButtonSelected);
});

$(document).on("click", resetSettingsButton, resetDefaultSettings);

$(document).on("click", testNotificationsButton, function () {
  chrome.extension.sendMessage({ action: "testNotifications" });
});
