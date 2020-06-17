import { TikTakApi } from "../tikTak/TikTakApi";
import { Configuration } from "../configuration/Configuration";
import configurationData from "../configuration/TestConfiguration.json";
import { TestCase } from "../configuration/TestCase";

var expect = require("chai").expect;
const addContext = require("mochawesome/addContext");

describe("Sanity tests", () => {
	const configuration = new Configuration(configurationData);
	const tikTakApi = new TikTakApi(
		configuration.tikTakBaseUrl,
		configuration.apiKey
	);

	const testData = configuration.GetTestData();

	for (const i in testData) {
		const testCase = testData[i];

		it(testCase.TestCase, async () => {
			PrintTestConditions(Number(i), testData);
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

function PrintTestConditions(i: number, testData: TestCase[]) {
	const testCase = testData[i];
	console.log(
		`\nTest Case number ${i}: MoovitResponse should be: ${testCase.MoovitResponse}`
	);
	console.log(`Parameters:\n###########\n`);
	console.log(`TestCase: ${testCase.TestCase}`);
	console.log(`MoovitResponse: ${testCase.MoovitResponse}`);
	console.log(`ServerCodeExpected: ${testCase.ServerCodeExpected}`);
	console.log(`Conditions: ${testCase.Conditions}`);
	console.log(`OriginLocation: ${testCase.OriginLocation}`);
	console.log(`DestinationLocation: ${testCase.DestinationLocation}`);
	// addContext(this, "Parameters:\n###########\n");
	// addContext(this, testCase);
}
