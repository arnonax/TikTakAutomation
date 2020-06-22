import { TikTakSearchResults } from "./TikTakSearchResults";
import { RouteOptionsResponse, TravelOptionState } from "../typescript-node-client/api";
import "../infrastructure/logger";
import { ApiClient } from "../infrastructure/apiClient";

// TODO: fix swagger to define the reponse of TravelOptions correctly.
type TravelOptionsResponse = {
	error?: Error;
	data: TravelOptionState;
};

export class TikTakApi {
	private _apiClient: ApiClient;

	constructor(baseUrl: string, apiKey: string) {
		this._apiClient = new ApiClient(baseUrl, apiKey);
	}

	async getTravelOptions(origin: string, destination: string): Promise<TikTakSearchResults> {
		const routeOptionsResponse = await this._apiClient.get<RouteOptionsResponse>("routes/options", {
			origin: origin,
			destination: destination,
			transit_mode: "bus",
		});

		const requestId = routeOptionsResponse.data?.requestId;
		if (requestId === undefined) {
			throw new Error("requestId is not defined in route options response");
		}

		const travelOptionsResponse = await this._apiClient.get<TravelOptionsResponse>(`travel-options/${requestId}`);

		return new TikTakSearchResults(travelOptionsResponse.data);
	}
}
