import { TikTakSearchResults } from "./TikTakSearchResults";
import Axios from "axios";

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
		const response = await Axios.get(
			`${this._baseUrl}routes/options?origin=${origin}&destination=${destination}&transit_mode=bus`,
			{ headers: { "x-api-key": this._apiKey } }
		);
		return new TikTakSearchResults(response.data);
	}
}
