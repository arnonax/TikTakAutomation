import { TikTakSearchResults } from "./TikTakSearchResults";
import * as api from "../typescript-node-client/api";
import * as http from "http";

interface ITikTakResponseMessage {
	error?: Error;
}

type Response<TBody extends ITikTakResponseMessage> = {
	response: http.IncomingMessage;
	body: TBody;
};

// Defining this type here because swagger doesn't match the actual structure
type TravelOptionsResponseBody = {
	error?: Error;
	data: api.TravelOptionState;
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
		const routeOptionsResponse: Response<api.RouteOptionsResponse> = await new api.RoutesApi(
			this._baseUrl
		).getRouteOptions(origin, destination, "bus");

		this.validateResponse(routeOptionsResponse);
		const requestId = routeOptionsResponse.body.data?.requestId;
		if (requestId === undefined)
			throw new Error(
				"requestId is not defined in route options response"
			);

		const travelOptionsResponse = <Response<TravelOptionsResponseBody>>(
			await new api.TravelOptionsApi(this._baseUrl).getTravelOption(
				requestId
			)
		);
		this.validateResponse(travelOptionsResponse);

		return new TikTakSearchResults(travelOptionsResponse.body.data);
	}

	validateResponse<TBody extends ITikTakResponseMessage>(
		routeOptionsResponse: Response<TBody>
	) {
		const statusCode = routeOptionsResponse.response.statusCode;
		if (statusCode === undefined || statusCode >= 300)
			throw new Error(
				`Invalid status received from server: ${statusCode}`
			);

		const error = routeOptionsResponse.body.error;
		if (JSON.stringify(error) != "{}")
			throw new Error(`Received error from server: ${error}`);
	}
}
