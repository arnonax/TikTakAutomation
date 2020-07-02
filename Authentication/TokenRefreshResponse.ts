export class TokenRefreshResponse {
	error: Error;
	data: Data;
}

interface Data {
	authenticationToken: string;
	refreshToken: string;
}

interface Error {}
