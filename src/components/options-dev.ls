{
  localstorage_getbool
  localstorage_setbool
} = require 'libs_common/localstorage_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

require! {
  'js-yaml'
}

detect_if_opera = ->
  return navigator.userAgent.indexOf(' OPR/') != -1

polymer_ext {
  is: 'options-dev'
  properties: {
    categories_and_option_info: {
      type: Array
      value: []
    }

    enable: {
      type: String
    }
    
    disable: {
      type: String
    }
    
    enable_list: {
      type: Array
      computed: 'compute_enable_list(enable)'
    }
    
    disable_list: {
      type: Array
      computed: 'compute_disable_list(disable)'
    }
    
    categories_and_option_info_default: {
      type: Array
      value: [
        {
          category: 'Opções gerais do desenvolvedor Lazuli'
          options: [
            {
              name: 'display_dlog'
              description: 'Exibir informações registradas com dlog em console.log'
              recommended: 'all'
            }

            {
              name: 'refresh_livereload'
              description: 'Atualize as páginas automaticamente à medida que os arquivos são atualizados'
              recommended: 'all'
            }
            
            {
              name: 'show_beta_goals_and_interventions'
              description: 'Mostrar metas e intervenções marcadas como beta'
            }

            {
              name: 'show_hidden_goals_and_interventions'
              description: 'Mostrar metas e intervenções marcadas como ocultas'
            }

            {
              name: 'open_debug_console_on_load'
              description: 'Abre automaticamente o console de depuração quando a intervenção é carregada'
            }

            {
              name: 'devmode_use_cache'
              description: 'Use o cache de busca no modo de desenvolvedor (é usado automaticamente no modo de produção)'
            }

            {
              name: 'devmode_clear_cache_on_reload'
              description: 'Limpe o cache de busca ao recarregar'
            }
            
            {
              name: 'local_logging_server'
              description: 'Use localhost: 5000 como o URL do servidor de registro'
            }
            
            {
              name: 'check_for_updates_devmode'
              description: 'Usado para depurar o recurso de verificação de atualizações se a extensão foi carregada em modo sideload'
            }
          ]
        }

        {
          category: 'Opções da página de ação do navegador (visualização pop-up)'
          options: [
            {
              name: 'enable_debug_terminal'
              description: 'Mostrar botão de depuração (terminal para intervenções de depuração) na visualização pop-up'
              recommended: 'all'
            }
          ]
        }
        
        {
          category: 'Opções da página do Intervention Manager'
          options: [
            {
              name: 'index_show_url_bar'
              description: 'Mostrar barra de URL na parte inferior das páginas de extensão'
              recommended: 'opera'
            }
  
            {
              name: 'intervention_view_show_internal_names'
              description: 'Mostrar nomes internos de metas e intervenções'
            }
  
            {
              name: 'intervention_view_show_debug_all_interventions_goal'
              description: 'Mostrar a meta debug / all_interventions'
            }
  
            {
              name: 'intervention_view_show_parameters'
              description: 'Mostra os parâmetros para cada intervenção'
            }
  
            {
              name: 'intervention_view_show_randomize_button'
              description: 'Mostrar o botão de randomizar intervenções'
            }
          ]
        }
      ]
    }
  }

  compute_enable_list: (enable) ->
    if not enable?
      return []

    enable = enable.trim()

    if not enable.startsWith('[')
      enable = '[' + enable + ']'
    return [x.toString() for x in js-yaml.safeLoad(enable)]

  compute_disable_list: (disable) ->
    if not disable?
      return []

    disable = disable.trim()

    if not disable.startsWith('[')
      disable = '[' + disable + ']'
    return [x.toString() for x in js-yaml.safeLoad(disable)]

  option_changed: (evt) ->
    checked = evt.target.checked
    option_name = evt.target.option_name
    localstorage_setbool(option_name, checked)

  get_option_list_aliases: (option_name) ->
    output = {
      recommended: []
      unrecommended: []
    }

    is_opera = detect_if_opera()

    for {options} in this.categories_and_option_info_default
      for option in options

        if option.recommended == 'all'
          output.recommended.push option.name

        else if is_opera and option.recommended == 'opera'
          output.recommended.push option.name

        else
          output.unrecommended.push option.name
    return output

  expand_aliases_in_options_list: (options_list) ->
    output = []
    aliases = this.get_option_list_aliases()

    if options_list? and options_list.length > 0
      for option_name in options_list
        if aliases[option_name]?
          for x in aliases[option_name]
            output.push x

        else
          output.push option_name

    return output

  enable_options_list: (options_list) ->
    options_list = this.expand_aliases_in_options_list(options_list)
    for option_name in options_list
      localstorage_setbool(option_name, true)

  disable_options_list: (options_list) ->
    options_list = this.expand_aliases_in_options_list(options_list)
    for option_name in options_list
      localstorage_setbool(option_name, false)

  enable_recommended: ->
    this.enable_options_list(['recommended'])

  enable_and_disable_from_parameters: ->
    this.enable_options_list(this.enable_list)
    this.disable_options_list(this.disable_list)

  register_protocol_handler: ->
    #navigator.registerProtocolHandler('web+lazuli', chrome.extension.getURL('/redirect.html?q=') + '%s', 'Lazuli')
    navigator.registerProtocolHandler('web+lazuli', 'https://lazuli.github.io/to.html?q=%s', 'Lazuli')

  attached: ->
    if not localstorage_getbool('options_dev_already_opened')
      this.enable_recommended()
      localstorage_setbool('options_dev_already_opened', true)

    this.enable_and_disable_from_parameters()

    is_opera = detect_if_opera()

    categories_and_option_info = JSON.parse JSON.stringify this.categories_and_option_info_default

    for {options} in categories_and_option_info
      for option in options
        if option.recommended == 'all'
          option.description = 'Recommended: ' + option.description

        else if is_opera and option.recommended == 'opera'
          option.description = 'Recommended: ' + option.description
        option.value = localstorage_getbool(option.name)

    this.categories_and_option_info = categories_and_option_info
}