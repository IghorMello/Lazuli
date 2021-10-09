{
  set_override_enabled_interventions_once
  add_new_intervention
  remove_custom_intervention
  get_intervention_info
  get_interventions
} = require 'libs_backend/intervention_utils'

{get_goal_info} = require 'libs_common/goal_utils'

{
  compile_intervention_code
} = require 'libs_backend/intervention_editor_utils'

Polymer({
  is: 'intervention-editor-tutorial'
  properties: {
    default_code: {
      type: Object
      value: {
        hello_world_editor: '''
        alert("Hello World");
        '''
        flip_page_editor: '''
        window.onload = function() {
          document.body.style.transform = 'rotate(180deg)';
        }
        '''
        flip_page_css_editor: '''
          window.onload=function(){
            require_style(`
              body {
                transform: rotate(180deg);
              }
            `)
          }
        '''
        flip_page_jquery_editor: '''
          var $=require('jquery');
          $(document).ready(function(){
            $('body').css('transform', 'rotate(180deg)');
          });  
        '''
        change_opacity_editor:'''
          var $ = require('jquery');      
          setInterval(function() {
            $('body').css('opacity', Math.random());
          }, 1000);
        '''
        show_sw_dialog_editor: '''
          var sweetalert = require('sweetalert2');      
          sweetalert({
            title: 'Hello World',
            text: 'Esta é uma intervenção de amostra'
          })
        '''
        display_time_spent_editor:'''
          var sweetalert = require('sweetalert2');
          var {get_seconds_spent_on_current_domain_today} = require('libs_common/time_spent_utils');         
          var seconds_spent = await get_seconds_spent_on_current_domain_today();
          sweetalert('You have spent ' + seconds_spent + ' seconds here today');
        '''
        insert_msg_jquery_editor:'''
          var $ = require('jquery');
          var sweetalert = require('sweetalert2');
          
          var mydiv = $('<div>').text('Hello world').css({
            'background-color': 'red',
            'color': 'white',
            'z-index': 9007199254740991,
            'position': 'fixed',
            'top': '0px',
            'left': '0px'
          });
          
          mydiv.click(function() {
            sweetalert('a mensagem foi clicada');
          })
          
          $('body').append(mydiv);
        '''
        show_paper_button_editor:'''
          require_component('paper-button');
          
          var $ = require('jquery');
          var sweetalert = require('sweetalert2');
          
          var button = $('<paper-button>').text('Click me').css({
            'background-color': 'red',
            'color': 'white',
            'z-index': 9007199254740991,
            'position': 'fixed',
            'top': '0px',
            'left': '0px'
          });
          
          button.click(function() {
            sweetalert('a mensagem foi clicada');
          })
          
          $('body').append(button);
        '''
        show_custom_polymer_button_editor: '''
          require_component('paper-button');
          
          var $ = require('jquery');
          var sweetalert = require('sweetalert2');
          
          define_component(`
            <style>
              .redbutton {
                background-color: red;
                color: white;
                z-index: 9007199254740991;
                position: fixed;
                top: 0px;
                left: 0px;
              }
            </style>
            <template>
              <paper-button class="redbutton" on-click="button_clicked">Clique aqui</paper-button>
            </template>
          `, {
            is: 'my-button',
            button_clicked: function() {
              sweetalert('A mensagem foi clicada');
            }
          })
          
          var custom_component = $('<my-button>');
          $('body').append(custom_component);
        '''
        display_time_spent_custom_polymer_editor:'''
          var $ = require('jquery');
          
          define_component(`
            <style>
              .white_on_black {
                color: white;
                background-color: black;
                position: fixed;
                top: 0px;
                left: 0px;
                z-index: 9007199254740991;
              }
            </style>
            <template>
              <div class="white_on_black">
                <div>Olá você está aqui há {{seconds_elapsed}} segundos</div>
              </div>
            </template>
          `, {
            is: 'time-spent-counter-banner',
            properties: {
              seconds_elapsed: {
                type: Number,
                value: 0
              }
            },
            ready: function() {
              var self = this
              setInterval(function() {
                self.seconds_elapsed += 1
              }, 1000)
            }
          })
          
          var custom_component = $('<time-spent-counter-banner>');
          $('body').append(custom_component);
        '''
        display_time_spent_logo_close_editor:'''
          require_component('lazuli-logo-v2');
          require_component('close-tab-button');
          
          var $ = require('jquery');
          
          define_component(`
            <style>
              .white_on_black {
                color: white;
                background-color: black;
                position: fixed;
                top: 0px;
                left: 0px;
                z-index: 9007199254740991;
                text-align: center;
                padding: 10px;
              }
            </style>
            <template>
              <div class="white_on_black">
                <div>Olá você está aqui há {{seconds_elapsed}} segundos</div>
                <lazuli-logo-v2></lazuli-logo-v2>
                <br>
                <close-tab-button></close-tab-button>
              </div>
            </template>
          `, {
            is: 'time-spent-counter-banner',
            properties: {
              seconds_elapsed: {
                type: Number,
                value: 0
              }
            },
            ready: function() {
              var self = this
              setInterval(function() {
                self.seconds_elapsed += 1
              }, 1000)
            }
          })
          
          var custom_component = $('<time-spent-counter-banner>');
          $('body').append(custom_component);
        '''
        use_external_library_editor:'''
          var d3 = require_remote('https://d3js.org/d3.v4.min.js');
          alert('imported d3 version ' + d3.version);
        '''
      }
    }
    js_editors: {
      type: Object
      value: {}
    }
    templates_info_list: {
      type:Array
    }
  }
  demo_clicked: (evt) ->>
    editor_name = evt.target.getAttribute('srcname')
    # temp_code=this.$$('#' + editor_name).getSession().getValue().trim()
    temp_code=this.js_editors[editor_name].getSession().getValue().trim()
    # temp_code = this.default_code[editor_name]
    temp_goal_info = await get_goal_info("reddit/spend_less_time")
    temp_intervention_info = {
      code:temp_code
      name:"temp_intervention"
      domain:temp_goal_info.domain
      preview:temp_goal_info.preview
      sitename:temp_goal_info.sitename
      sitename_printable:temp_goal_info.sitename_printable
      goals:[temp_goal_info.name]
      custom:true
      description: "temp"
      matches:[temp_goal_info.domain]
      content_scripts:temp_code
    }

    if not (await compile_intervention_code(temp_intervention_info))
      return false

    await add_new_intervention(temp_intervention_info)
    set_override_enabled_interventions_once temp_intervention_info.name
    preview_page = temp_intervention_info.preview

    if not preview_page?
      preview_page = 'https://' + temp_goal_info.domain + '/'
    chrome.tabs.create {url: preview_page}

  advanced_demo_clicked: (evt) ->>
    intervention_name= evt.target.id.substring 5
    set_override_enabled_interventions_once intervention_name
    intervention_info = await get_intervention_info(intervention_name)
    if intervention_info.preview?
      preview_page = intervention_info.preview
    else if intervention_info.sitename=='generic'
      preview_page = 'https://www.reddit.com/'
    else
      goal_info = await get_goal_info(intervention_info.goals[0])
      preview_page = goal_info.preview ? ('https://' + goal_info.domain + '/')
    chrome.tabs.create {url: preview_page}

  rerender: ->>
    self = this
    brace = await SystemJS.import('brace')
    await SystemJS.import('brace/mode/javascript')
    await SystemJS.import('brace/ext/language_tools')
    brace.acequire('ace/ext/language_tools')
    editor_list = Object.keys(this.default_code)

    for editor_name in editor_list
      js_editor = brace.edit(self.$$('#' + editor_name))
      self.js_editors[editor_name]=js_editor
      js_editor.setOptions({
        enableBasicAutocompletion: true
        enableSnippets: true
        enableLiveAutocompletion: true
      });

      await SystemJS.import('brace/theme/monokai')
      js_editor.setTheme('ace/theme/monokai')
      js_editor.getSession().setMode('ace/mode/javascript')
      js_editor.getSession().setTabSize(2)
      js_editor.getSession().setUseSoftTabs(true)
      js_editor.setValue(this.default_code[editor_name].trim())
    all_interventions=await get_interventions()
    templates_list=['generic/make_user_wait',"generic/toast_notifications","iqiyi/prompt_before_watch","iqiyi/remove_sidebar_links","netflix/infinite_alarm","netflix/link_articles","facebook/remove_news_feed","facebook/rich_notifications"]
    this.templates_info_list=[all_interventions[x] for x in templates_list]
  ready: ->
    this.rerender()
})
