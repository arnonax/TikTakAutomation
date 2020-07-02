export class LoginVerificationResponse {
	error: Error;
	data: Data;
}

class Data {
	authenticationToken: string;
	refreshToken: string;
}

class Error {}
