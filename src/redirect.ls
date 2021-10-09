get_url_without_trim_params = ->
  url = window.location.href
  for x in [
    '&utm_source=tr.im'
    '&utm_medium=no_referer'
    '&utm_campaign=tr.im%2Fhab'
    '&utm_content=direct_input'
  ]
    if url.indexOf(x) != -1
      url = url.split(x).join('')
  return url

location_url = get_url_without_trim_params()

getUrlParameters = ->
  url = location_url
  hash = url.lastIndexOf('#')
  if hash != -1
    url = url.slice(0, hash)
  map = {}
  parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) ->
    #map[key] = decodeURI(value).split('+').join(' ').split('%2C').join(',') # for whatever reason this seems necessary?
    map[key] = decodeURIComponent(value).split('+').join(' ') # for whatever reason this seems necessary?
  )
  return map

serialize = (obj, prefix) ->
  str = []
  for p, v of obj
    k = if prefix then prefix + "[" + p + "]" else p
    if typeof v == "object"
      str.push(serialize(v, k))
    else
      str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v))

  str.join("&")

params = getUrlParameters()
if params.utm_source == 'tr.im'
  delete params.utm_source
  delete params.utm_medium
  delete params.utm_campaign
  delete params.utm_content

query = params.q
if not query?
  if params.tag?
    query = 'index.html?' + serialize(params)
    params = {}
  else
    qidx = location_url.indexOf('?')
    if qidx != -1
      query = location_url.substr(qidx + 1)
      if query.endsWith('=')
        query = query.substr(0, query.length - 1)
      params = {}
    else
      query = 'options'
      params = {}

do ->
  if not query.startsWith('web lazuli:')
    return
  seen_colon = false
  is_alphanumeric = (x) ->
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(x) != -1
  for i from 0 til query.length
    c = query[i]
    if c == ':'
      seen_colon = true
      continue
    if seen_colon and is_alphanumeric(c)
      query := query.substr(i)
      return
  query := 'options'

hash = window.location.hash
if not hash?
  hash = ''
if hash.startsWith('#')
  hash = hash.substr(1)

hash_idx = query.indexOf('#')
if hash_idx != -1
  hash = query.substr(hash_idx + 1)
  query = query.substr(0, hash_idx)

if query == 'settings' or query == 'config'
  query = 'options.html'
  hash = 'settings'
if query == 'options'
  query = 'options.html'
  if hash == ''
    hash = 'settings'
if query == 'popup'
  query = 'popup.html'
if query == 'dashboard' or query == 'results'
  query = 'options.html'
  hash = 'results'
if query == 'onboarding'
  query = 'options.html'
  hash = 'onboarding'
if query.startsWith('index.html') or query.startsWith('options.html') or query.startsWith('popup.html') or query.startsWith('index_jspm.html')
  delete params.q
  if Object.keys(params).length > 0
    if query.indexOf('?') == -1
      query = query + '?' + serialize(params)
    else
      query = query + '&' + serialize(params)
  url = chrome.extension.getURL('/') + query
else
  query = query.split('?').join('&')
  delete params.q
  if Object.keys(params).length > 0
    query = query + '&' + serialize(params)
  query = query.split('=&').join('&')
  if query.endsWith('=')
    query = query.substr(0, query.length - 1)
  url = chrome.extension.getURL('/index.html?tag=' + query)


if hash.length > 0
  window.location.href = url + '#' + hash
else
  window.location.href = url
