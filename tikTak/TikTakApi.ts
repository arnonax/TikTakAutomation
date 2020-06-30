import { TikTakSearchResults } from "./TikTakSearchResults";
import { RouteOptionsResponse, TravelOptionState, TravelStateResponse } from "../typescript-node-client/api";
import "../infrastructure/logger";
import { ApiClient } from "../infrastructure/apiClient";
import ApiEndpointsPaths from "../configuration/TikTakApiEndpointsPaths.json";
import { Logger } from "../infrastructure/logger";
import { LoginVerificationResponse } from "../Models/LoginVerificationResponse";
import { LoginVerificationRequest } from "../Models/LoginVerificationRequest";
import AuthenticationStorage from "../Authentication/AuthenticationStorage.json";
import { TokenRefreshResponse } from "../Authentication/TokenRefreshResponse";

// TODO: fix swagger to define the reponse of TravelOptions correctly.
type TravelOptionsResponse = {
	error?: Error;
	data: TravelOptionState;
};

export class TikTakApi {
	private _apiClient: ApiClient;

	constructor(private baseUrl: string, private apiKey: string) {}

	async initialize() {
		const updatedAuthenticationToken: string = await this.getUpdatedAuthenticationToken(this.baseUrl, this.apiKey);
		this._apiClient = new ApiClient(this.baseUrl, this.apiKey, updatedAuthenticationToken);
	}

	private async getUpdatedAuthenticationToken(baseUrl: string, apiKey: string): Promise<string> {
		const refreshToken = { refreshToken: AuthenticationStorage.refreshToken };
		this._apiClient = new ApiClient(baseUrl, apiKey, AuthenticationStorage.authenticationToken);
		const tokenRefreshResponse = await this._apiClient.post<TokenRefreshResponse>(
			ApiEndpointsPaths["token-refresh"],
			undefined,
			refreshToken
		);
		const newAuthenticationToken = tokenRefreshResponse.data.authenticationToken;
		const newRefreshToken = tokenRefreshResponse.data.refreshToken;
		await this.saveNewAuthenticationToken(newAuthenticationToken, newRefreshToken);
		this._apiClient = new ApiClient(baseUrl, apiKey, newAuthenticationToken);
		return newAuthenticationToken;
	}
	private async saveNewAuthenticationToken(newAuthenticationToken: string, newRefreshToken: string) {
		const fs = require("fs").promises;
		const tokenObject = {
			authenticationToken: newAuthenticationToken,
			refreshToken: newRefreshToken,
		};
		let tokenJson = JSON.stringify(tokenObject, null, 2);

		Logger.logMessage("Saving AuthenticationStorage file....");
		await fs.writeFile("./Authentication/AuthenticationStorage.json", tokenJson, (err: any) => {
			if (err) {
				Logger.logMessage(JSON.stringify(err));
			}
			Logger.logMessage("Data written to AuthenticationStorage.json file");
		});
	}

	async getTravelOptions(origin: string, destination: string): Promise<TikTakSearchResults> {
		const routeOptionsResponse = await this._apiClient.get<RouteOptionsResponse>(
			ApiEndpointsPaths["routes-options"],
			{
				origin: origin,
				destination: destination,
				transit_mode: "bus",
			}
		);

		const requestId = routeOptionsResponse.data?.requestId;
		if (requestId === undefined) {
			throw new Error("requestId is not defined in route options response");
		}

		const travelOptionsResponse = await this._apiClient.get<TravelOptionsResponse>(
			`${ApiEndpointsPaths["travel-options"]}/${requestId}`
		);

		return new TikTakSearchResults(requestId, travelOptionsResponse.data);
	}

	async loginVerify(phoneNumber: string, verificationCode: string): Promise<LoginVerificationResponse> {
		const path = ApiEndpointsPaths.verify;
		const loginVerificationRequest: LoginVerificationRequest = { phoneNumber, verificationCode };

		const loginResponse = await this._apiClient.post<LoginVerificationResponse>(
			ApiEndpointsPaths.verify,
			undefined,
			loginVerificationRequest
		);
		return loginResponse;
	}

	async getTravelState(): Promise<TravelStateResponse> {
		throw new Error("Method not implemented.");
	}
	async bookMeTravel(requestId: string) {
		throw new Error("Method not implemented.");
	}
}
