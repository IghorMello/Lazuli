class LongBreakTimer extends Timer {
	constructor(time, completedPomodoros) {
		super(time, completedPomodoros);
		this._badgeColor = "#0060df";
		this._notificationMessage = "Você completou o ciclo pomodoro! Aproveite sua pausa mais longa.";
		this._notificationImage = "images/breakIcon.png";
		this._type = "Long Break";
	}

	showNotification() {
		new Notification("Intervalo grande!", this._notificationMessage, this._notificationImage).show();
	}

	change(settings) {
		return new PomodoroTime(TimerFormat.textToMilliseconds(settings.studytime), 0);
	}
}