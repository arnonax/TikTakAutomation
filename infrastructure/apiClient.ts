import { Logger } from "./logger";
import Axios, { AxiosResponse } from "axios";

export interface ITikTakResponseMessage {
	error?: Error;
}

export class ApiClient {
	constructor(private _baseUrl: string, private _apiKey: string) {}

	async get<TResponse>(path: string, queryStringArgs?: any): Promise<TResponse> {
		let queryString = "";
		if (queryStringArgs) {
			queryString = Object.keys(queryStringArgs)
				.map((key) => `${key}=${queryStringArgs[key]}`)
				.join("&");
			if (queryString.length > 0) queryString = "?" + queryString;
		}
		const fullUrl = `${this._baseUrl}${path}${queryString}`;

		Logger.logMessage(`Sending request to ${fullUrl}`);

		const response = await Axios.get<TResponse>(fullUrl, {
			headers: { "x-api-key": this._apiKey },
		});

		this.validateResponse(response);
		Logger.logMessage(`Response=${JSON.stringify(response.data)}`);

		return response.data;
	}

	private validateResponse<T extends ITikTakResponseMessage>(response: AxiosResponse<T>) {
		const statusCode = response.status;
		if (statusCode === undefined || statusCode >= 300) {
			throw new Error(`Invalid status received from server: ${statusCode}`);
		}

		const error = response.data.error;
		if (JSON.stringify(error) != "{}") {
			throw new Error(`Received error from server: ${error}`);
		}
	}
}
