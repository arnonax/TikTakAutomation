export class Logger {
	static _logMessageImpl: (message: string) => void;

	static init(logMessageImpl: (message: string) => void) {
		this._logMessageImpl = logMessageImpl;
	}

	static logMessage(message: string) {
		this._logMessageImpl(message);
	}
}
