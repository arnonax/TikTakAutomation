import { TitTakResult } from "./TitTakResult";
import { TravelOptionState, TravelOptionResponse } from "../typescript-node-client/api";

export class TikTakSearchResults {
	waitUntilValidForBooking() {
		throw new Error("Method not implemented.");
	}
	getRequestId() {
		throw new Error("Method not implemented.");
	}
	getStatus(): string {
		return TravelOptionResponse.StatusEnum[this._responseData.updates![0].status!];
	}

	get tikTakResult(): TitTakResult {
		return new TitTakResult();
	}

	constructor(private _responseData: TravelOptionState) {}
}
