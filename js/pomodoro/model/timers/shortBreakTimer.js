class ShortBreakTimer extends Timer {
	constructor(time, completedPomodoros) {
		super(time, completedPomodoros);
		this._badgeColor = "#006504";
		this._notificationMessage = "É hora de fazer uma pausa.";
		this._notificationImage = "images/breakIcon.png";
		this._type = "Intervalo curto";
	}

	showNotification() {
		new Notification("Intervalo curto", this._notificationMessage, this._notificationImage).show();
	}

	change(settings) {
		return new StudyTimer(TimerFormat.textToMilliseconds(settings.studytime), this._completedPomodoros);
	}
}