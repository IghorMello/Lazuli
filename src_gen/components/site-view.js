const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils');

const swal = require('sweetalert2');

const $ = require('jquery');

const { load_css_file } = require('libs_common/content_script_utils');

const {
  list_site_info_for_sites_for_which_goals_are_enabled,
  list_goals_for_site,
  get_goals,
  list_all_goals,
} = require('libs_backend/goal_utils');

const {
  get_interventions,
  get_enabled_interventions
} = require('libs_backend/intervention_utils');

const {
  as_array
} = require('libs_common/collection_utils');

const { remoteget_json } = require('libs_common/cacheget_utils');

const {
  log_pageclick
} = require('libs_backend/log_utils');

polymer_ext({
  is: 'site-view',
  properties: {
    site: {
      type: String,
      observer: 'site_changed'
    },

    goal_info: {
      type: Object
    },

    intervention_name_to_info_map: {
      type: Object
    },

    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    },

    interrupt_0: {
      type: Number,
      value: 0
    },

    show_market: {
      type: Boolean,
      value: localStorage.show_market == 'true'
    },
  },

  isdemo_changed: function (isdemo) {
    if (isdemo) {
      this.site = 'facebook'
      this.rerender()
    }
  },

  intervention_name_to_info: function (intervention_name, intervention_name_to_info_map) {
    return intervention_name_to_info_map[intervention_name];
  },

  ready: function () {
    load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
  },

  help_icon_clicked: function () {
    swal({
      title: 'Como o Lazuli funciona',
      html: `
      O Lazuli o ajudará a atingir seu objetivo, mostrando a você um <i> alerta </i> diferente, como um bloqueador de feed de notícias ou um carregador de página atrasado, cada vez que você visitar o site de seu objetivo.
      
      <br><br>
      
      A princípio, o Lazuli mostrará um alerta aleatório a cada visita e, com o tempo, aprenderá o que funciona de maneira mais eficaz para você.
      
      <br><br>

      A cada visita, o Lazuli testará um novo toque e medirá quanto tempo você passa no site. Em seguida, ele determina a eficácia de cada nudge comparando o tempo gasto por visita quando aquele nudge foi implantado, em comparação com quando outros nudges são implantados. Lazuli usa uma técnica algorítmica chamada <a href="https://en.wikipedia.org/wiki/Multi-armed_bandit" target="_blank"> multiarmed-bandit </a> para aprender quais nudges funcionam melhor e escolher que cutuca para implantar, para minimizar o tempo perdido online. 
      `,

      allowOutsideClick: true,
      allowEscapeKey: true,
    })
  },

  somemethod: function () {
    this.rerender()
  },

  rerender1: async function () {
    const [goal_info_list, intervention_name_to_info_map, enabled_interventions] = await Promise.all([
      list_goals_for_site(this.site),
      get_interventions(),
      get_enabled_interventions()
    ])

    for (let intervention_name of Object.keys(intervention_name_to_info_map)) {
      const intervention_info = intervention_name_to_info_map[intervention_name];
      intervention_info.enabled = (enabled_interventions[intervention_name] == true);
    }

    return [intervention_name_to_info_map, goal_info_list]
  },

  rerender: async function () {
    let [intervention_name_to_info_map, goal_info_list] = await this.rerender1()
    this.goal_info = goal_info_list[0];
    this.intervention_name_to_info_map = intervention_name_to_info_map;
    this.interrupt_0 += 1

    if (this.interrupt_0 == 100) {
      this.interrupt_0 = 0;
    }
  },

  site_changed: async function (site) { },
  vote_for_nudge_clicked: function () {
    console.log('Alerta selecionado')
    this.fire('go_to_voting', {})
  },

  code_custom_nudge_clicked: function () {
    chrome.tabs.create({ url: chrome.extension.getURL('index.html?tag=intervention-editor') });
    log_pageclick({ from: 'site-view', tab: this.site, to: 'intervention-editor' });
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'first_elem'
  ]
})