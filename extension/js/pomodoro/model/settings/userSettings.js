class UserSettings {
	constructor(
		pomodoros,
		pomodorotime,
		shortbreak,
		longbreak,
		soundEnabled
	) {
		this._pomodoros = pomodoros;
		this._pomodorotime = pomodorotime;
		this._shortbreak = shortbreak;
		this._longbreak = longbreak;
		this._soundEnabled = soundEnabled;
	}

	get pomodoros() {
		return this._pomodoros;
	}

	get pomodorotime() {
		return this._pomodorotime;
	}

	get shortbreak() {
		return this._shortbreak;
	}

	get longbreak() {
		return this._longbreak;
	}

	get soundEnabled() {
		return this._soundEnabled;
	}

	set pomodoros(pomodoros) {
		this._pomodoros = pomodoros;
	}

	set pomodorotime(pomodorotime) {
		this._pomodorotime = pomodorotime;
	}

	set shortbreak(shortbreak) {
		this._shortbreak = shortbreak;
	}

	set longbreak(longbreak) {
		this._longbreak = longbreak;
	}

	set soundEnabled(soundEnabled) {
		this._soundEnabled = soundEnabled;
	}
}