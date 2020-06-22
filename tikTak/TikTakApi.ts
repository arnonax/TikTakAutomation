import { TikTakSearchResults } from "./TikTakSearchResults";
import Axios, { AxiosResponse } from "axios";
import {
	RouteOptionsResponse,
	TravelOptionState,
} from "../typescript-node-client/api";

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
		const routeOptionsResponse = await Axios.get<RouteOptionsResponse>(
			`${this._baseUrl}routes/options?origin=${origin}&destination=${destination}&transit_mode=bus`,
			{ headers: { "x-api-key": this._apiKey } }
		);

		this.validateResponse(routeOptionsResponse);
		const requestId = routeOptionsResponse.data.data?.requestId;
		if (requestId === undefined)
			throw new Error(
				"requestId is not defined in route options response"
			);

		const travelOptionsResponse = await Axios.get<TravelOptionsResponse>(
			`${this._baseUrl}travel-options/${requestId}`,
			{ headers: { "x-api-key": this._apiKey } }
		);

		this.validateResponse(travelOptionsResponse);

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
