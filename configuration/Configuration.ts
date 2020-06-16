import { readFileSync } from "fs";
import Papa from "papaparse";
import { TestCase } from "./TestCase";

export class Configuration {
	private _configurationData: any;
	constructor(configurationData: any) {
		this._configurationData = configurationData;
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
