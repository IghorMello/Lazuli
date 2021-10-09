(function(){
  var moment, ref$, gexport, gexport_module, get_days_since_epoch, pad_to_two_digits, printable_time_spent_short, printable_time_spent, printable_time_spent_long, out$ = typeof exports != 'undefined' && exports || this;
  moment = require('moment');
  ref$ = require('libs_common/gexport'), gexport = ref$.gexport, gexport_module = ref$.gexport_module;
  out$.get_days_since_epoch = get_days_since_epoch = function(){
    var start_of_epoch;
    start_of_epoch = moment().year(2016).month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
    return moment().diff(start_of_epoch, 'days');
  };
  pad_to_two_digits = function(val){
    var output;
    output = val.toString();
    if (output.length === 1) {
      return '0' + output;
    }
    return output;
  };
  out$.printable_time_spent_short = printable_time_spent_short = function(seconds){
    var minutes;
    if (seconds < 0) {
      return '00:00';
    }
    minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;
    return minutes + ':' + pad_to_two_digits(seconds);
  };
  out$.printable_time_spent = printable_time_spent = function(seconds){
    if (seconds < 60) {
      return seconds + ' seconds';
    }
    return moment().add(seconds, 'seconds').fromNow(true);
  };
  /**
  * Return time spent in hours, minutes, seconds format
  * @param {Integer} seconds - seconds spent
  * @return {String} 
  */
  out$.printable_time_spent_long = printable_time_spent_long = function(seconds){
    var hours, remaining_seconds, minutes, output;
    if (seconds < 0) {
      return '0 seconds';
    }
    hours = Math.floor(seconds / 3600);
    remaining_seconds = seconds - hours * 3600;
    minutes = Math.floor(remaining_seconds / 60);
    remaining_seconds = remaining_seconds - minutes * 60;
    output = [];
    if (hours > 0) {
      if (hours === 1) {
        output.push('1 hour');
      } else {
        output.push(hours + ' hours');
      }
    }
    if (minutes > 0 || hours > 0) {
      if (minutes === 1) {
        output.push('1 minute');
      } else {
        output.push(minutes + ' minutes');
      }
    }
    if (remaining_seconds === 1) {
      output.push('1 second');
    } else if (remaining_seconds >= 0) {
      output.push(remaining_seconds + ' seconds');
    }
    return output.join(' ');
  };
  gexport_module('time_utils', function(it){
    return eval(it);
  });
}).call(this);
