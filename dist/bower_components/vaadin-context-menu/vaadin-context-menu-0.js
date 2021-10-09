
    Polymer({
      is: 'vaadin-context-menu',

      behaviors: [Polymer.Templatizer],

      properties: {

        /**
         * CSS selector that can be used to target any child element
         * of the context menu to listen for `openOn` events.
         */
        selector: {
          type: String
        },

        /**
         * True if the overlay is currently displayed.
         */
        opened: {
          type: Boolean,
          value: false,
          notify: true,
          readOnly: true
        },

        /**
         * Event name to listen for opening the context menu.
         */
        openOn: {
          type: String,
          value: 'vaadin-contextmenu'
        },

        /**
         * The target element that's listened to for context menu opening events.
         * By default the vaadin-context-menu listens to the target's `vaadin-contextmenu`
         * events.
         * @type {HTMLElement}
         * @default self
         */
        listenOn: {
          type: Object,
          value: function() {
            return this;
          }
        },

        /**
         * Event name to listen for closing the context menu.
         */
        closeOn: {
          type: String,
          value: 'click',
          observer: '_closeOnChanged'
        },

        _context: Object,

        _contentTemplate: Object,

        _instanceProps: {
          value: function() {
            return {
              detail: true,
              target: true
            };
          }
        }
      },

      observers: [
        '_contentTemplateChanged(_contentTemplate)',
        '_openedChanged(opened)',
        '_contextChanged(_context, _instance)',
        '_targetOrOpenOnChanged(listenOn, openOn, isAttached)'
      ],

      _onOverlayOpened: function() {
        var child = Polymer.dom(this.$.overlay).querySelector(':not(style)');
        if (child) {
          child.focus();
        }

        // Close context menu on backdrop right-click
        this.$.overlay.backdropElement.addEventListener('contextmenu', function(e) {
          this.close();
          e.preventDefault();
        }.bind(this), false);
      },

      _onOverlayClosed: function() {
        this._setOpened(false);
      },

      _targetOrOpenOnChanged: function(listenOn, openOn, isAttached) {
        if (this._oldListenOn && this._oldOpenOn) {
          this.unlisten(this._oldListenOn, this._oldOpenOn, 'open');

          this._oldListenOn.style.webkitTouchCallout = '';
          this._oldListenOn.style.webkitUserSelect = '';

          this._oldListenOn = null;
          this._oldOpenOn = null;
        }

        if (listenOn && openOn && isAttached) {
          this.listen(listenOn, openOn, 'open');

          // note: these styles don't seem to work in Firefox on iOS.
          listenOn.style.webkitTouchCallout = 'none';
          listenOn.style.webkitUserSelect = 'none';

          this._oldListenOn = listenOn;
          this._oldOpenOn = openOn;
        }
      },

      _closeOnChanged: function(closeOn, oldCloseOn) {
        if (oldCloseOn) {
          this.unlisten(this, oldCloseOn, 'close');
        }
        if (closeOn) {
          this.listen(this, closeOn, 'close');
        }
      },

      _openedChanged: function(opened) {
        if (opened) {
          this._contentTemplate = Polymer.dom(this).children.filter(function(el) {
            return el.localName === 'template';
          })[0];
        }
      },

      _contextChanged: function(context, instance) {
        instance.detail = context.detail;
        instance.target = context.target;
      },

      /**
       * Closes the overlay.
       */
      close: function() {
        this._setOpened(false);
      },

      _contextTarget: function(e) {
        if (this.selector) {
          var targets = Polymer.dom(this.listenOn).querySelectorAll(this.selector);

          return targets.filter(function(el) {
            return Polymer.dom(e).path.indexOf(el) > -1;
          })[0];
        } else {
          return Polymer.dom(e).localTarget;
        }
      },

      /**
       * Opens the overlay.
       * @param {Event} e used as the context for the menu. Overlay coordinates are taken from this event.
       */
      open: function(e) {
        if (e) {
          this._context = {
            detail: e.detail,
            target: this._contextTarget(e)
          };

          if (this._context.target) {
            e.preventDefault();
            e.stopPropagation();

            this.$.overlay.resetFit();

            this.$.overlay.x = this._getEventCoordinate(e, 'x');
            this.$.overlay.y = this._getEventCoordinate(e, 'y');

            this._setOpened(true);
          }
        }
      },

      _getEventCoordinate: function(event, coord) {
        if (event.detail instanceof Object) {
          if (event.detail[coord]) {
            // Polymer gesture events, get coordinate from detail
            return event.detail[coord];
          } else if (event.detail.sourceEvent) {
            // Unwrap detailed event
            return this._getEventCoordinate(event.detail.sourceEvent, coord);
          }
        } else {
          // Native mouse or touch event
          var prop = 'client' + coord.toUpperCase();
          return event.changedTouches ? event.changedTouches[0][prop] : event[prop];
        }
      },

      _forwardParentProp: function(prop, value) {
        // set initial value to instance.
        this._instance.notifyPath(prop, value);

        this.dataHost.notifyPath(prop, value);
      },

      _forwardParentPath: function(path, value) {
        this.dataHost.notifyPath(path, value);
      },

      _contentTemplateChanged: function(template) {
        Polymer.dom(this.$.overlay).innerHTML = '';
        if (template) {
          this.templatize(template);

          this._instance = this.stamp({});

          Polymer.dom(this.$.overlay).appendChild(this._instance.root);
        }
      }
    });
  