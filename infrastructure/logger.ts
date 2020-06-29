export class Logger {
	static _logMessageImpl: (message: string) => void;

	static init(logMessageImpl: (message: string) => void) {
		this._logMessageImpl = logMessageImpl;
	}

	static logMessage(message: string, toLogToConsole: boolean = false) {
		this._logMessageImpl(message);
		if (toLogToConsole) {
			console.log(message);
		}
	}
}
