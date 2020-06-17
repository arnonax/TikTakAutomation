import { readFileSync } from "fs";
import Papa from "papaparse";
import { TestCase } from "./TestCase";

export class Configuration {
	private _configurationData: any;

	tikTakBaseUrl: string;
	apiKey: string;

	constructor(configurationData: any) {
		this._configurationData = configurationData;
		this.tikTakBaseUrl = this._configurationData.tikTakBaseUrl;
		this.apiKey = this._configurationData.apiKey;
	}

	GetTestData(): TestCase[] {
		const testCasesFile = readFileSync(
			this._configurationData.testCasesCsvFilePath,
			"utf8"
		);
		const results = Papa.parse<TestCase>(testCasesFile, {
			header: true,
		});
		return results.data;
	}
}
