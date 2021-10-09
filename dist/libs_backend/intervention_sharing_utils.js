(function(){
  var post_json, upload_intervention, list_interventions_for_author, out$ = typeof exports != 'undefined' && exports || this;
  post_json = require('libs_backend/ajax_utils').post_json;
  out$.upload_intervention = upload_intervention = async function(intervention_info, author_info, is_sharing){
    var logging_server_url, intervention_info_with_author, data, upload_successful, response, e;
    console.log(intervention_info);
    console.log(author_info);
    if (localStorage.getItem('local_logging_server') === 'true') {
      console.log("posting to local server");
      logging_server_url = 'http://localhost:5000/';
    } else {
      console.log("posting to cloud server");
      logging_server_url = 'https://lazuli.herokuapp.com/';
    }
    intervention_info_with_author = intervention_info;
    intervention_info_with_author.author_email = author_info.email;
    intervention_info_with_author.author_id = author_info.id;
    data = import$({}, intervention_info_with_author);
    data.logname = "share_intervention_repo";
    data.is_sharing = is_sharing;
    console.log(data);
    data.key = author_info.id + Date.now();
    upload_successful = true;
    try {
      console.log('Posting data to: ' + logging_server_url + 'sharedintervention');
      response = (await post_json(logging_server_url + 'sharedintervention', data));
      console.log(response);
      if (response.success) {
        if (is_sharing) {
          return {
            status: 'success',
            url: logging_server_url + "lookupintervention?share=y&id=" + data.key
          };
        } else {
          return {
            status: 'success',
            url: logging_server_url + "lookupintervention?share=n&id=" + data.key
          };
        }
      } else {
        upload_successful = false;
        dlog('response from server was not successful in upload_intervention');
        dlog(response);
        dlog(data);
        console.log('response from server was not successful in upload_intervention');
        return {
          status: 'failure',
          url: 'https://lazuli.stanford.edu'
        };
      }
    } catch (e$) {
      e = e$;
      upload_successful = false;
      dlog('error thrown in upload_intervention');
      dlog(e);
      dlog(data);
      dlog(data.logname);
      console.log('error thrown in upload_intervention');
      return {
        status: 'failure',
        url: 'https://lazuli.stanford.edu'
      };
    }
  };
  out$.list_interventions_for_author = list_interventions_for_author = async function(author_info){
    return [];
  };
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
