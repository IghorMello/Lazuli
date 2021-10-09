skate = require 'skatejs'

{
  url_to_domain,
} = require 'libs_common/domain_utils'

{
  get_seconds_spent_on_domain_today,
} = require 'libs_common/time_spent_utils'

#require('components_skate/habitlab-logo')
require('components/habitlab-logo.deps')

update_page = (elem) ->
  get_seconds_spent_on_domain_today elem.site, (seconds_spent) ->
    elem.seconds = seconds_spent

skate.define 'fb-scroll-block-display', {
  props: {
    site: { default: url_to_domain(window.location.href) }
    seconds: { default: 0 }
    intervention: { default: '', attribute: true}
  }
  events: {
    'click #clickme': (elem, eventObject) ->
      console.log 'clickme div was clicked'
      skate.emit elem, 'continue_scrolling'
  }
  render: (elem) !->

    elem_style = {

      'display': 'table-cell',
      'background-color': 'red',
      'position': 'fixed',
      'color': 'white',
      'width': '100%',
      'top': '0px',
      'right': '0px',
      'z-index': '99999',
      'text-align': 'center'
    }

    ``
    return (
    <div style="display: table; height: 50px">

      <div id="clickme" style={elem_style}>
        <br/><div>You have already spent {elem.seconds} seconds on {elem.site}. Consider doing something more productive! Click here to continue scrolling.

      </div><br/>
      </div>
    </div>
    )
    ``
  attached: (elem) ->
    update_page(elem)
    setInterval ->
      update_page(elem)
    , 1000
}
