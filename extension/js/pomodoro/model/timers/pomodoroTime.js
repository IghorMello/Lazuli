class PomodoroTime extends Timer {
	constructor(time, completedPomodoros) {
		super(time, completedPomodoros);
		this._badgeColor = "#737373";
		this._notificationMessage = "Seu intervalo acabou. De volta ao trabalho!";
		this._notificationImage = "images/studyIcon.png";
		this._type = "Trabalhar";
	}

	showNotification() {
		new NotificationPomodoro("Hora de trabalhar", this._notificationMessage, this._notificationImage).show();
	}

	change(settings) {
		let breakTimer;
		this._completedPomodoros++;

		if (this._completedPomodoros < settings.pomodoros) {
			breakTimer = new ShortBreakTimer(TimerFormat.textToMilliseconds(settings.shortbreak), this._completedPomodoros);
		} else {
			breakTimer = new LongBreakTimer(TimerFormat.textToMilliseconds(settings.longbreak), 0);
		}
		return breakTimer;
	}
}