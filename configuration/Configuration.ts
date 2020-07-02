import { readFileSync } from "fs";
import Papa from "papaparse";
import { TestCase } from "../TestData/TestCase";

export class Configuration {
	tikTakBaseUrl: string;
	apiKey: string;
	phoneNumber: string;
	verificationCode: string;
	driverId: string;
	vehicleId: string;

	constructor(private _configurationData: any) {
		this.tikTakBaseUrl = this._configurationData.tikTakBaseUrl;
		this.apiKey = this._configurationData.apiKey;
		this.phoneNumber = this._configurationData.phoneNumber;
		this.verificationCode = this._configurationData.verificationCode;
		this.driverId = this._configurationData.driverId;
		this.vehicleId = this._configurationData.vehicleId;
	}

	GetTestData(): TestCase[] {
		const testCasesFile = readFileSync(this._configurationData.testCasesCsvFilePath, "utf8");
		const results = Papa.parse<TestCase>(testCasesFile, {
			header: true,
		});
		return results.data;
	}
}
