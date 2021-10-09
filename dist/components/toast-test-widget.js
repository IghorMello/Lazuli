const {
  show_toast
} = require('libs_frontend/toast_utils')

Polymer({
  is: 'toast-test-widget',
  ready: function () {
    show_toast('foobar')
  }
})
