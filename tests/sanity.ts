import { TikTakApi } from "../tikTak/TikTakApi";
import { Configuration } from "../configuration/Configuration";
import configurationData from "../configuration/TestConfiguration.json";
import { TestCase } from "../configuration/TestCase";
import { Logger } from "../infrastructure/logger";

var expect = require("chai").expect;
const addContext = require("mochawesome/addContext");
const readlineSync = require("readline-sync");

describe("Sanity tests", function () {
	const configuration = new Configuration(configurationData);
	const tikTakApi = new TikTakApi(configuration.tikTakBaseUrl, configuration.apiKey);

	before(function () {
		Logger.init((message) => {
			addContext(this, message);
		});
	});
	const testData = configuration.GetTestData();

	for (const i in testData) {
		const testCase = testData[i];

		it(testCase.TestCase, async function () {
			PrintTestConditions(this, Number(i), testData);
			const travelOptions = await tikTakApi.getTravelOptions(
				testCase.OriginLocation,
				testCase.DestinationLocation
			);

			const status = travelOptions.getStatus();
			expect(status).to.equal(testCase.ServerCodeExpected);
		});
	}
});

function PrintTestConditions(test: any, i: number, testData: TestCase[]) {
	const testCase = testData[i];
	console.log(`\nTest Case number ${i}: MoovitResponse should be: ${testCase.MoovitResponse}`);
	addContext(test, "Parameters:");
	addContext(test, JSON.stringify(testCase, null, "   "));
}
