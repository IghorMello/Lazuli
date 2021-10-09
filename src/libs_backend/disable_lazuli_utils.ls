{
  get_active_tab_id
  disable_interventions_in_all_tabs
} = require 'libs_backend/background_common'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export disable_lazuli = ->>
  days_since_epoch = get_days_since_epoch()
  localStorage.setItem 'lazuli_disabled', (days_since_epoch).toString()
  #await disable_interventions_in_active_tab()
  #tabId = await get_active_tab_id()
  #chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon_disabled.svg')}
  await disable_interventions_in_all_tabs()
  tabs = await new Promise -> chrome.tabs.query {}, it
  for tab in tabs
    chrome.browserAction.setIcon {tabId: tab.id, path: chrome.extension.getURL('icons/icon_disabled.svg')}

export enable_lazuli = ->>
  localStorage.removeItem 'lazuli_disabled'
  tabs = await new Promise -> chrome.tabs.query {}, it
  for tab in tabs
    chrome.browserAction.setIcon {tabId: tab.id, path: chrome.extension.getURL('icons/icon.svg')}
  #tabId = await get_active_tab_id()
  #chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon.svg')}
  #chrome.browserAction.setIcon {path: chrome.extension.getURL('icons/icon.svg')}

export is_lazuli_enabled = ->>
  return is_lazuli_enabled_sync()

export is_lazuli_enabled_sync = ->
  days_since_epoch = get_days_since_epoch()
  return localStorage.getItem('lazuli_disabled') != (days_since_epoch).toString()

gexport_module 'disable_lazuli_utils', -> eval(it)