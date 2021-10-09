/* livescript */

(function(it){
  return it();
})(function(){
  var get_url_without_trim_params, location_url, getUrlParameters, serialize, params, query, qidx, hash, hash_idx, shortcuts, url;
  if (!(window.location.pathname === '/redirect' || window.location.pathname === '/redirect.html' || window.location.pathname === '/go' || window.location.pathname === '/go.html' || window.location.pathname === '/to' || window.location.pathname === '/to.html')) {
    return;
  }
  get_url_without_trim_params = function(){
    var url, i$, ref$, len$, x;
    url = window.location.href;
    for (i$ = 0, len$ = (ref$ = ['&utm_source=tr.im', '&utm_medium=no_referer', '&utm_campaign=tr.im%2Fhab', '&utm_content=direct_input']).length; i$ < len$; ++i$) {
      x = ref$[i$];
      if (url.indexOf(x) !== -1) {
        url = url.split(x).join('');
      }
    }
    return url;
  };
  location_url = get_url_without_trim_params();
  getUrlParameters = function(){
    var url, hash, map, parts;
    url = location_url;
    hash = url.lastIndexOf('#');
    if (hash !== -1) {
      url = url.slice(0, hash);
    }
    map = {};
    parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
      return map[key] = decodeURIComponent(value).split('+').join(' ');
    });
    return map;
  };
  serialize = function(obj, prefix){
    var str, p, v, k;
    str = [];
    for (p in obj) {
      v = obj[p];
      k = prefix ? prefix + "[" + p + "]" : p;
      if (typeof v === "object") {
        str.push(serialize(v, k));
      } else {
        str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  };
  params = getUrlParameters();
  if (params.utm_source === 'tr.im') {
    delete params.utm_source;
    delete params.utm_medium;
    delete params.utm_campaign;
    delete params.utm_content;
  }
  query = params.q;
  if (query == null) {
    if (params.tag != null) {
      query = 'index.html?' + serialize(params);
      params = {};
    } else {
      qidx = location_url.indexOf('?');
      if (qidx !== -1) {
        query = location_url.substr(qidx + 1);
        if (query.endsWith('=')) {
          query = query.substr(0, query.length - 1);
        }
        params = {};
      } else {
        query = 'options';
        params = {};
      }
    }
  }
  (function(){
    var seen_colon, is_alphanumeric, i$, to$, i, c;
    if (!query.startsWith('web lazuli:')) {
      return;
    }
    seen_colon = false;
    is_alphanumeric = function(x){
      return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(x) !== -1;
    };
    for (i$ = 0, to$ = query.length; i$ < to$; ++i$) {
      i = i$;
      c = query[i];
      if (c === ':') {
        seen_colon = true;
        continue;
      }
      if (seen_colon && is_alphanumeric(c)) {
        query = query.substr(i);
        return;
      }
    }
    return query = 'options';
  })();
  hash = window.location.hash;
  if (hash == null) {
    hash = '';
  }
  if (hash.startsWith('#')) {
    hash = hash.substr(1);
  }
  hash_idx = query.indexOf('#');
  if (hash_idx !== -1) {
    hash = query.substr(hash_idx + 1);
    query = query.substr(0, hash_idx);
  }
  shortcuts = {
    github: 'https://github.com/lazuli/lazuli',
    commits: 'https://github.com/lazuli/lazuli/commits/master',
    designs: 'https://github.com/lazuli/lazuli/wiki/designs',
    gitter: 'https://gitter.im/lazuli/lazuli',
    slack: 'https://stanfordhcigfx.slack.com/messages/lazuli/',
    publish: 'https://chrome.google.com/webstore/developer/dashboard',
    chrome: 'https://chrome.google.com/webstore/detail/lazuli/obghclocpdgcekcognpkblghkedcpdgd'
  };
  if (shortcuts[query] != null) {
    window.location.href = shortcuts[query];
    return;
  }
  if (query === 'wiki' || query.startsWith('wiki/') || query === 'issues' || query.startsWith('issues/')) {
    window.location.href = 'https://github.com/lazuli/lazuli/' + query;
    return;
  }
  if (query === 'editor') {
    query = 'intervention-editor';
  }
  if (query === 'update') {
    query = 'update-check';
  }
  if (query === 'logs') {
    query = 'logs.html';
  }
  if (query === 'settings' || query === 'config') {
    query = 'options.html';
    hash = 'settings';
  }
  if (query === 'options') {
    query = 'options.html';
    if (hash === '') {
      hash = 'settings';
    }
  }
  if (query === 'popup') {
    query = 'popup.html';
  }
  if (query === 'dashboard' || query === 'results') {
    query = 'options.html';
    hash = 'results';
  }
  if (query === 'onboarding') {
    query = 'options.html';
    hash = 'onboarding';
  }
  if (query.startsWith('index.html') || query.startsWith('options.html') || query.startsWith('popup.html') || query.startsWith('index_jspm.html') || query.startsWith('logs.html')) {
    delete params.q;
    if (Object.keys(params).length > 0) {
      if (query.indexOf('?') === -1) {
        query = query + '?' + serialize(params);
      } else {
        query = query + '&' + serialize(params);
      }
    }
    url = chrome.extension.getURL('/') + query;
  } else {
    query = query.split('?').join('&');
    delete params.q;
    if (Object.keys(params).length > 0) {
      query = query + '&' + serialize(params);
    }
    query = query.split('=&').join('&');
    if (query.endsWith('=')) {
      query = query.substr(0, query.length - 1);
    }
    url = chrome.extension.getURL('/index.html?tag=' + query);
  }
  if (hash.length > 0) {
    return window.location.href = url + '#' + hash;
  } else {
    return window.location.href = url;
  }
});