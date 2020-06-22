import { TikTakSearchResults } from "./TikTakSearchResults";
import Axios, { AxiosResponse } from "axios";
import {
	RouteOptionsResponse,
	TravelOptionState,
} from "../typescript-node-client/api";
import "../infrastructure/logger";
import { Logger } from "../infrastructure/logger";

interface ITikTakResponseMessage {
	error?: Error;
}

// TODO: fix swagger to define the reponse of TravelOptions correctly.
type TravelOptionsResponse = {
	error?: Error;
	data: TravelOptionState;
};

export class TikTakApi {
	private _baseUrl: string;
	private _apiKey: string;

	constructor(baseUrl: string, apiKey: string) {
		this._baseUrl = baseUrl;
		this._apiKey = apiKey;
	}

	async getTravelOptions(
		origin: string,
		destination: string
	): Promise<TikTakSearchResults> {
		Logger.logMessage(
			`Sending RouteOptions request from ${origin} to ${destination}`
		);

		const routeOptionsResponse = await Axios.get<RouteOptionsResponse>(
			`${this._baseUrl}routes/options?origin=${origin}&destination=${destination}&transit_mode=bus`,
			{ headers: { "x-api-key": this._apiKey } }
		);

		this.validateResponse(routeOptionsResponse);
		Logger.logMessage(
			`Got RouteOptions response: ${JSON.stringify(
				routeOptionsResponse.data
			)}`
		);

		const requestId = routeOptionsResponse.data.data?.requestId;
		if (requestId === undefined)
			throw new Error(
				"requestId is not defined in route options response"
			);

		Logger.logMessage(
			`Sending TravelOptions request with requestId ${requestId}`
		);
		const travelOptionsResponse = await Axios.get<TravelOptionsResponse>(
			`${this._baseUrl}travel-options/${requestId}`,
			{ headers: { "x-api-key": this._apiKey } }
		);

		this.validateResponse(travelOptionsResponse);
		Logger.logMessage(
			`Got TravelOptions response: ${JSON.stringify(
				travelOptionsResponse.data
			)}`
		);

		return new TikTakSearchResults(travelOptionsResponse.data.data);
	}

	validateResponse<T extends ITikTakResponseMessage>(
		response: AxiosResponse<T>
	) {
		const statusCode = response.status;
		if (statusCode === undefined || statusCode >= 300)
			throw new Error(
				`Invalid status received from server: ${statusCode}`
			);

		const error = response.data.error;
		if (JSON.stringify(error) != "{}")
			throw new Error(`Received error from server: ${error}`);
	}
}
