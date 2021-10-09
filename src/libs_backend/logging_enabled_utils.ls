{
  post_json
} = require 'libs_backend/ajax_utils'

{
  get_user_id
  get_install_id
} = require 'libs_backend/background_common'

if chrome?runtime?getManifest?
  chrome_manifest = chrome.runtime.getManifest()
  lazuli_version = chrome_manifest.version
  developer_mode = not chrome_manifest.update_url?
  unofficial_version = chrome.runtime.id != 'obghclocpdgcekcognpkblghkedcpdgd'
else
  lazuli_version = 'test'
  developer_mode = true
  unofficial_version = true

export get_basic_client_data = ->>
  data = {}
  data.client_timestamp = Date.now()
  data.client_localtime = new Date().toString()
  data.user_id = await get_user_id()
  data.install_id = await get_install_id()
  data.browser = navigator.userAgent
  data.language = navigator.language
  data.languages = navigator.languages
  data.version = lazuli_version
  data.devmode = developer_mode
  data.chrome_runtime_id = chrome.runtime.id
  if unofficial_version
    data.unofficial_version = chrome.runtime.id
  return data

export send_logging_enabled = (options) ->>
  options = options ? {}
  data = await get_basic_client_data()
  data.logging_enabled = true
  for k,v of options
    data[k] = v
  post_json('https://lazuli.herokuapp.com/add_logging_state', data)
  return

export send_logging_disabled = (options) ->>
  options = options ? {}
  data = await get_basic_client_data()
  data.logging_enabled = false
  for k,v of options
    data[k] = v
  post_json('https://lazuli.herokuapp.com/add_logging_state', data)
  return

export send_feature_option = (options) ->>
  options = options ? {}
  data = await get_basic_client_data()
  for k,v of options
    data[k] = v
  post_json('https://lazuli.herokuapp.com/add_feature_state', data)
  return

export send_feature_enabled = (options) ->>
  options = options ? {}
  data = await get_basic_client_data()
  data.feature_enabled = true
  for k,v of options
    data[k] = v
  post_json('https://lazuli.herokuapp.com/add_feature_state', data)
  return

export send_feature_disabled = (options) ->>
  options = options ? {}
  data = await get_basic_client_data()
  data.feature_enabled = false
  for k,v of options
    data[k] = v
  post_json('https://lazuli.herokuapp.com/add_feature_state', data)
  return
