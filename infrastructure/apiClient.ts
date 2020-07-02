import { Logger } from "./logger";
import Axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { LoginVerificationRequest } from "../Models/LoginVerificationRequest";

export interface ITikTakResponseMessage {
	error?: Error;
}

export class ApiClient {
	constructor(private _baseUrl: string, private _apiKey: string, private _authenticationToken: string) {
		this._axiosRequestConfig = this.createAxiosRequestConfig(true);
	}
	private _axiosRequestConfig: AxiosRequestConfig;

	private createAxiosRequestConfig(isContainedAuthorization: boolean = false): AxiosRequestConfig {
		let axiosRequestConfig: AxiosRequestConfig;
		if (isContainedAuthorization) {
			axiosRequestConfig = {
				headers: {
					"x-api-key": this._apiKey,
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${this._authenticationToken}`,
				},
			};
		} else {
			axiosRequestConfig = {
				headers: {
					"x-api-key": this._apiKey,
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			};
		}
		return axiosRequestConfig;
	}

	async get<TResponse>(path: string, queryStringArgs?: any): Promise<TResponse> {
		let queryString = "";
		queryString = this.buildQueryString(queryStringArgs, queryString);
		const fullUrl = `${this._baseUrl}${path}${queryString}`;

		Logger.logMessage(`Sending request to ${fullUrl}`);

		const response = await Axios.get<TResponse>(fullUrl, this._axiosRequestConfig);

		this.validateResponse(response);
		Logger.logMessage(`Response=${JSON.stringify(response.data)}`);

		return response.data;
	}

	async post<TResponse>(path: string, queryStringArgs?: any, body?: any): Promise<TResponse> {
		let queryString = "";
		queryString = this.buildQueryString(queryStringArgs, queryString);
		const fullUrl = `${this._baseUrl}${path}${queryString}`;

		Logger.logMessage(`Sending request to ${fullUrl}`);

		const response = await Axios.post<TResponse>(fullUrl, body, this._axiosRequestConfig);

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
	private buildQueryString(queryStringArgs: any, queryString: string) {
		if (queryStringArgs) {
			queryString = Object.keys(queryStringArgs)
				.map((key) => `${key}=${queryStringArgs[key]}`)
				.join("&");
			if (queryString.length > 0) {
				queryString = "?" + queryString;
			}
		}
		return queryString;
	}
}
