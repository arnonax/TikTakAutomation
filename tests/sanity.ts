import { TikTakApi } from "../tikTak/TikTakApi";
import { Configuration } from "../configuration/Configuration";
import configurationData from "../configuration/TestConfiguration.json";
import { TestCase } from "../configuration/TestCase";

var expect = require("chai").expect;
const addContext = require("mochawesome/addContext");

describe("Sanity tests", function () {
	const configuration = new Configuration(configurationData);
	const tikTakApi = new TikTakApi(
		configuration.tikTakBaseUrl,
		configuration.apiKey
	);

	const testData = configuration.GetTestData();

	for (const i in testData) {
		const testCase = testData[i];

		it(testCase.TestCase, async function () {
			PrintTestConditions(this, Number(i), testData);
			const routes = await tikTakApi.searchRoutes(
				testCase.OriginLocation,
				testCase.DestinationLocation
			);
			//const tikTakResult = routes.tikTakResult;
			//const titTakStatus = tikTakResult.titTakStatus;
			//expect(titTakStatus).to.equal(testCase.ServerCodeExpected);
			expect(routes.hasTikTakResult()).to.equal(false);
		});
	}
});

function PrintTestConditions(test: any, i: number, testData: TestCase[]) {
	const testCase = testData[i];
	console.log(
		`\nTest Case number ${i}: MoovitResponse should be: ${testCase.MoovitResponse}`
	);
	addContext(test, "Parameters:");
	addContext(test, JSON.stringify(testCase, null, "   "));
}
