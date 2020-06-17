import { TitTakResult } from "./TitTakResult";
import { TravelOptionState } from "../typescript-node-client/api";

export class TikTakSearchResults {
	getStatus() {
		throw new Error("Method not implemented.");
	}
	private _responseData: TravelOptionState;

	get tikTakResult(): TitTakResult {
		return new TitTakResult();
	}

	constructor(responseData: TravelOptionState) {
		this._responseData = responseData;
	}
}
