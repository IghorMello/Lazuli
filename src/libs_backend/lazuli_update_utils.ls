require! {
  semver
}

{
  get_user_id
  get_install_id
} = require 'libs_backend/background_common'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'


chrome_manifest = chrome.runtime.getManifest()
lazuli_version = chrome_manifest.version
developer_mode = not chrome_manifest.update_url?

export run_check_for_update_if_needed = ->
  if developer_mode
    return
  if not (chrome.runtime.id == 'obghclocpdgcekcognpkblghkedcpdgd' or chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina')
    return
  last_time_update_checked = localStorage.getItem('lazuli_last_time_checked_for_updates')
  if last_time_update_checked?
    last_time_update_checked = parseInt(last_time_update_checked)
  else
    last_time_update_checked = 0
  current_time = Date.now()
  if last_time_update_checked + 1000*60*15 > current_time # within the past 15 minutes
    return
  localStorage.setItem('lazuli_last_time_checked_for_updates', current_time)
  chrome.runtime.requestUpdateCheck (status, details) ->
    return

export get_latest_lazuli_version = ->>
  chrome_runtime_id = 'obghclocpdgcekcognpkblghkedcpdgd'
  if chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina'
    chrome_runtime_id = 'bleifeoekkfhicamkpadfoclfhfmmina'
  user_id = await get_user_id()
  install_id = await get_install_id()
  latest_version_info = await fetch('https://lazuli.herokuapp.com/app_version?appid=' + chrome_runtime_id + '&userid=' + user_id + '&installid=' + install_id).then((.json!))
  if (not latest_version_info?version?) or (not semver.valid(latest_version_info.version))
    return null
  return latest_version_info.version

export is_lazuli_update_available = ->>
  latest_version = await get_latest_lazuli_version()
  if not latest_version?
    return false
  return semver.gt(latest_version, lazuli_version)

export check_if_update_available_and_run_update = ->>
  is_checking_for_updates_enabled = false
  if (chrome.runtime.id == 'obghclocpdgcekcognpkblghkedcpdgd' or chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina')
    is_checking_for_updates_enabled = true
  else
    if developer_mode and localStorage.getItem('check_for_updates_devmode') == 'true'
      is_checking_for_updates_enabled = true
  if not is_checking_for_updates_enabled
    return false
  update_available = await is_lazuli_update_available()
  if update_available
    run_check_for_update_if_needed()
  return update_available

gexport_module 'lazuli_update_utils', -> eval(it)
