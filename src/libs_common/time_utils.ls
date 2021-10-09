require! {
  moment
}

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export get_days_since_epoch = ->
  start_of_epoch = moment().year(2016).month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(0)
  return moment().diff(start_of_epoch, 'days')

pad_to_two_digits = (val) ->
  output = val.toString()
  if output.length == 1
    return '0' + output
  return output

export printable_time_spent_short = (seconds) ->
  if seconds < 0
    return '00:00'
  minutes = Math.floor(seconds / 60)
  seconds = seconds - (minutes * 60)
  return minutes + ':' + pad_to_two_digits(seconds)

export printable_time_spent = (seconds) ->
  if seconds < 60
    return seconds + ' seconds'
  return moment().add(seconds, 'seconds').fromNow(true)

/**
* Return time spent in hours, minutes, seconds format
* @param {Integer} seconds - seconds spent
* @return {String} 
*/
export printable_time_spent_long = (seconds) ->
  if seconds < 0
    return '0 seconds'
  hours = Math.floor(seconds / 3600)
  remaining_seconds = seconds - (hours * 3600)
  minutes = Math.floor(remaining_seconds / 60)
  remaining_seconds = remaining_seconds - (minutes * 60)
  output = []
  if hours > 0
    if hours == 1
      output.push '1 hour'
    else
      output.push (hours + ' hours')
  if minutes > 0 or hours > 0
    if minutes == 1
      output.push '1 minute'
    else
      output.push (minutes + ' minutes')
  if remaining_seconds == 1
    output.push '1 second'
  else if remaining_seconds >= 0
    output.push (remaining_seconds + ' seconds')
  return output.join(' ')

gexport_module 'time_utils', -> eval(it)
