
    Polymer({
      is: 'vaadin-grid-table-focus-trap',

      hostAttributes: {
        'tabindex': -1,
        'role': 'gridcell' // gridcell roles are for VoiceOver to announce "you're in a cell"
      },

      listeners: {
        'focus': '_onFocus',
        'focusin': '_stopPropagationForReannouncing',
        'focusout': '_stopPropagationForReannouncing'
      },

      properties: {
        activeTarget: {
          type: String,
          observer: '_activeTargetChanged'
        },
      },

      ready: function() {
        this._primary = Polymer.dom(this.root).querySelector('.primary');
        this._secondary = Polymer.dom(this.root).querySelector('.secondary');

        // In native shadow, focus traps need to be inside the same scope as
        // the "labelled by" elements
        if (Polymer.Settings.useNativeShadow) {
          Polymer.dom(this).appendChild(this._primary);
          Polymer.dom(this).appendChild(this._secondary);
        }
      },

      _onFocus: function(e) {
        this._primary.focus();
      },

      _onBaitFocus: function(e) {
        // TODO: remove this custom event after FF52 with native focusin support
        // is in use.
        this.fire('focusin');

        this._focused = e.target;
      },

      _onBaitBlur: function(e) {
        // TODO: remove this custom event after FF52 with native focusout support
        // is in use.
        this.fire('focusout');
      },

      _activeTargetChanged: function(target) {
        // moving focus seems to be the most reliable way to get different screenreaders
        // to announce the "aria-labelledby" property
        if (this._focused === this._primary) {
          this._secondary.setAttribute('aria-labelledby', target);
          this._secondary.focus();
        } else {
          this._primary.setAttribute('aria-labelledby', target);
          this._primary.focus();
        }
      },

      _reannounce: function() {
        this._isReannouncing = true;
        if (this._focused === this._primary) {
          this._secondary.setAttribute('aria-labelledby', this.activeTarget);
          this._secondary.focus();
        } else {
          this._primary.setAttribute('aria-labelledby', this.activeTarget);
          this._primary.focus();
        }
        this._isReannouncing = false;
      },

      _stopPropagationForReannouncing: function(e) {
        if (this._isReannouncing) {
          // When reannouncing, the event is fake and must not be processed
          e.stopImmediatePropagation();
          e.stopPropagation();
        }
      }

    });
  