(function(){
  var semver, ref$, get_user_id, get_install_id, gexport, gexport_module, chrome_manifest, lazuli_version, developer_mode, run_check_for_update_if_needed, get_latest_lazuli_version, is_lazuli_update_available, check_if_update_available_and_run_update, out$ = typeof exports != 'undefined' && exports || this;
  semver = require('semver');
  ref$ = require('libs_backend/background_common'), get_user_id = ref$.get_user_id, get_install_id = ref$.get_install_id;
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  chrome_manifest = chrome.runtime.getManifest();
  lazuli_version = chrome_manifest.version;
  developer_mode = chrome_manifest.update_url == null;
  out$.run_check_for_update_if_needed = run_check_for_update_if_needed = function(){
    var last_time_update_checked, current_time;
    if (developer_mode) {
      return;
    }
    if (!(chrome.runtime.id === 'obghclocpdgcekcognpkblghkedcpdgd' || chrome.runtime.id === 'bleifeoekkfhicamkpadfoclfhfmmina')) {
      return;
    }
    last_time_update_checked = localStorage.getItem('lazuli_last_time_checked_for_updates');
    if (last_time_update_checked != null) {
      last_time_update_checked = parseInt(last_time_update_checked);
    } else {
      last_time_update_checked = 0;
    }
    current_time = Date.now();
    if (last_time_update_checked + 1000 * 60 * 15 > current_time) {
      return;
    }
    localStorage.setItem('lazuli_last_time_checked_for_updates', current_time);
    return chrome.runtime.requestUpdateCheck(function(status, details){});
  };
  out$.get_latest_lazuli_version = get_latest_lazuli_version = async function(){
    var chrome_runtime_id, user_id, install_id, latest_version_info, this$ = this;
    chrome_runtime_id = 'obghclocpdgcekcognpkblghkedcpdgd';
    if (chrome.runtime.id === 'bleifeoekkfhicamkpadfoclfhfmmina') {
      chrome_runtime_id = 'bleifeoekkfhicamkpadfoclfhfmmina';
    }
    user_id = (await get_user_id());
    install_id = (await get_install_id());
    latest_version_info = (await fetch('https://lazuli.herokuapp.com/app_version?appid=' + chrome_runtime_id + '&userid=' + user_id + '&installid=' + install_id).then(function(it){
      return it.json();
    }));
    if ((latest_version_info != null ? latest_version_info.version : void 8) == null || !semver.valid(latest_version_info.version)) {
      return null;
    }
    return latest_version_info.version;
  };
  out$.is_lazuli_update_available = is_lazuli_update_available = async function(){
    var latest_version;
    latest_version = (await get_latest_lazuli_version());
    if (latest_version == null) {
      return false;
    }
    return semver.gt(latest_version, lazuli_version);
  };
  out$.check_if_update_available_and_run_update = check_if_update_available_and_run_update = async function(){
    var is_checking_for_updates_enabled, update_available;
    is_checking_for_updates_enabled = false;
    if (chrome.runtime.id === 'obghclocpdgcekcognpkblghkedcpdgd' || chrome.runtime.id === 'bleifeoekkfhicamkpadfoclfhfmmina') {
      is_checking_for_updates_enabled = true;
    } else {
      if (developer_mode && localStorage.getItem('check_for_updates_devmode') === 'true') {
        is_checking_for_updates_enabled = true;
      }
    }
    if (!is_checking_for_updates_enabled) {
      return false;
    }
    update_available = (await is_lazuli_update_available());
    if (update_available) {
      run_check_for_update_if_needed();
    }
    return update_available;
  };
  gexport_module('lazuli_update_utils', function(it){
    return eval(it);
  });
}).call(this);
