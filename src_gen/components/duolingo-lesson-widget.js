const {
  polymer_ext,
} = require('libs_frontend/polymer_utils');

const {
  get_duolingo_info,
  get_duolingo_is_logged_in,
  wait_until_user_is_logged_in
} = require('libs_common/duolingo_utils')

const {
  set_alternative_url_to_track
} = require('libs_frontend/content_script_utils')

let noStreakMessages = [
  "Para aprender LANGUAGE é necessário praticar um pouco todos os dias! Você pode fazer isso!",
  "Para aprender LANGUAGE, basta praticar um pouco todos os dias. Você conseguiu!",
  "Tem alguns minutos para praticar sua LÍNGUA agora?",
  "Lembra-se do seu objetivo de completar uma lição de Duolingo a cada dia? Aqui está a chance de fazê-lo!",
  "Com a prática consistente, você será ótimo em LANGUAGE antes que perceba!",
  "Parece que você está de folga - bom momento para um pouco de Duolingo? :)"
]
let shortStreakToContinueMessages = [
  "Bom trabalho em conseguir uma sequência de STREAK dias no Duolingo! Você pode estendê-la hoje mesmo aqui.",
  "Gostaria de estender sua seqüência de STREAK-day no Duolingo? Você pode fazer isso aqui mesmo!",
  "Tudo o que você precisa para aprender LANGUAGE é um pouco de prática todos os dias, o que você tem feito nos últimos dias STREAK. Você conseguiu!",
  "Tem alguns minutos para praticar sua LÍNGUA agora? Isso vai estender sua seqüência!"
]
let longStreakToContinueMessages = [
  "Parabéns por alcançar uma sequência ininterrupta de STREAK dias no Duolingo! Quer estendê-la agora?",
  "Você está matando no Duolingo! STREAK dias e contando. Rock on!"
]
let streakAlreadyExtendedMessages = [
  "Se você quiser praticar mais hoje, aqui está a próxima lição.",
  "Ótimo trabalho no seu objetivo do Duolingo hoje! Quer mais prática? (Se não, você pode clicar no botão abaixo do questionário para desativá-lo pelo resto do dia.)",
  "Parece que você está de folga - bom momento para mais um pouco de Duolingo? :)"
]

let streakPlaceholder = "STREAK"
let languagePlaceholder = "LANGUAGE"
let longStreakThreshold = 5

polymer_ext({
  is: 'duolingo-lesson-widget',
  properties: {
    languageInitials: String,
    skillTitle: String,
    skillURL: String,
    lessonNumber: Number,

    lessonTitle: {
      type: String,
      value: "Carregando Duolingo..."
    },

    callToAction: {
      type: String,
      value: ""
    },

    iframeURL: {
      type: String,
      value: ""
    },

    isLoggedIn: {
      type: Boolean,
      value: true
    },

    duolingoIconURL: {
      type: String,
      value: chrome.extension.getURL('goals/duolingo/complete_lesson_each_day/icon.svg')
    },

    streak: Number,
    streakExtendedToday: Boolean,
    hovered: {
      type: Boolean,
      value: false
    }
  },

  ready: async function () {
    let [isLoggedIn, info] = await Promise.all([get_duolingo_is_logged_in(), get_duolingo_info()])

    if (info != null && Object.keys(info).length > 0) {
      this.streak = info.site_streak
      let learningLanguage = info.learning_language
      let languageData = info.language_data[learningLanguage]
      this.initializeWithLanguageData(languageData)
    } else {
      this.callToAction = "Este empurrão do Lazuli precisa que você esteja conectado ao Duolingo para funcionar." //This nudge injects language practice from Duolingo into the news feed. Why not pick a language (or sign in if you have an account) and get started now?"
      this.lessonTitle = "Faça login para ativar"
      this.isLoggedIn = false
      this.iframeURL = "https://www.duolingo.com/skill/en/introduction"
    }
  },

  initializeWithLanguageData: function (languageData) {
    this.languageInitials = languageData.language
    console.log(languageData)

    if ("next_lesson" in languageData) {
      this.setUpForNextLesson(languageData)
    } else {
      this.setUpForPractice(languageData)
    }

    // Pick a random encouraging message based on user's streak and whether it's been extended today yet.

    let callToActionMessageTemplate = ""

    // this.streak = languageData.streak <- if we want to use the language-specific streak

    if (this.streak == 0) {
      callToActionMessageTemplate = noStreakMessages[Math.floor(Math.random() * noStreakMessages.length)]
    }

    else if (!this.streakExtendedToday) {
      if (this.streak < longStreakThreshold) {
        callToActionMessageTemplate = shortStreakToContinueMessages[Math.floor(Math.random() * shortStreakToContinueMessages.length)]
      } else {
        callToActionMessageTemplate = longStreakToContinueMessages[Math.floor(Math.random() * longStreakToContinueMessages.length)]
      }
    } else {
      callToActionMessageTemplate = streakAlreadyExtendedMessages[Math.floor(Math.random() * streakAlreadyExtendedMessages.length)]
    }

    callToActionMessageTemplate = callToActionMessageTemplate.replace(streakPlaceholder, this.streak)
    this.callToAction = callToActionMessageTemplate.replace(languagePlaceholder, languageData.language_string)
  },

  setUpForNextLesson: function (languageData) {
    this.skillTitle = languageData.next_lesson.skill_title
    this.skillURL = languageData.next_lesson.skill_url
    this.lessonNumber = languageData.next_lesson.lesson_number
    this.lessonTitle = this.skillTitle + ", Lesson " + this.lessonNumber
    this.iframeURL = "https://www.duolingo.com/skill/" + this.languageInitials + "/" + this.skillURL + "/" + this.lessonNumber
  },

  setUpForPractice: function (languageData) {
    this.lessonTitle = languageData.language_string + " Practice"
    this.iframeURL = "https://www.duolingo.com/practice"
  },

  onHovered: function (evt) {
    this.hovered = true;
    set_alternative_url_to_track(this.iframeURL)
  },

  onUnhovered: function (evt) {
    this.hovered = false;
    set_alternative_url_to_track(null)
  },

  signinClicked: function (evt) {
    let login_timeout = 120

    wait_until_user_is_logged_in(login_timeout).then(async function (did_log_in) {
      if (did_log_in) {
        let info = await get_duolingo_info()
        if (info != null && Object.keys(info).length > 0) {
          this.streak = info.site_streak
          let learningLanguage = info.learning_language
          let languageData = info.language_data[learningLanguage]
          this.initializeWithLanguageData(languageData)
          this.isLoggedIn = true
        }
      }
    }.bind(this))
    window.open("https://www.duolingo.com")
  }
}, {
  source: require('libs_common/localization_utils'),
  methods: [
    'msg'
  ]
})