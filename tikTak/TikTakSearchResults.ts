import { TitTakResult } from "./TitTakResult";

export class TikTakSearchResults {
	getStatus() {
		throw new Error("Method not implemented.");
	}
	private _responseData: any;

	hasTikTakResult(): boolean {
		return this._responseData.data.travelOptions !== undefined;
	}
	get tikTakResult(): TitTakResult {
		return new TitTakResult();
	}

	constructor(responseData: any) {
		this._responseData = responseData;
	}
}
