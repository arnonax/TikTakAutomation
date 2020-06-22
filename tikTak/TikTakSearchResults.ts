import { TitTakResult } from "./TitTakResult";
import {
	TravelOptionState,
	TravelOptionResponse,
} from "../typescript-node-client/api";

export class TikTakSearchResults {
	getStatus(): string {
		return TravelOptionResponse.StatusEnum[
			this._responseData.updates![0].status!
		];
	}
	private _responseData: TravelOptionState;

	get tikTakResult(): TitTakResult {
		return new TitTakResult();
	}

	constructor(responseData: TravelOptionState) {
		this._responseData = responseData;
	}
}
