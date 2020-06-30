import { TikTakApi } from "../tikTak/TikTakApi";
import { Configuration } from "../configuration/Configuration";
import configurationData from "../configuration/TestConfiguration.json";
import { TestCase } from "../configuration/TestCase";
import { Logger } from "../infrastructure/logger";
import { TravelStateResponse } from "../typescript-node-client/api";

var expect = require("chai").expect;
const addContext = require("mochawesome/addContext");
const readlineSync = require("readline-sync");

describe("Sanity tests", async function () {
	const configuration = new Configuration(configurationData);
	const tikTakApi = new TikTakApi(configuration.tikTakBaseUrl, configuration.apiKey);

	before(async function () {
		Logger.init((message) => {
			addContext(this, message);
		});
		await tikTakApi.initialize();
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

	it("Book new Travel", async function () {
		// Arrange
		// Activate Driver
		const travelOptions = await tikTakApi.getTravelOptions("31.9966686, 34.8281923", "32.0015104, 34.8274526");
		const status = travelOptions.getStatus();
		const requestId = travelOptions.requestId;
		await travelOptions.waitUntilValidForBooking();

		// Act
		await tikTakApi.bookMeTravel(requestId);
		const travelsState: TravelStateResponse = await tikTakApi.getTravelState();

		// Assert
		expect(travelsState.state).to.equal(TravelStateResponse.StateEnum.Assigned);
	});
});

function PrintTestConditions(test: any, i: number, testData: TestCase[]) {
	const testCase = testData[i];
	console.log(`\nTest Case number ${i}: MoovitResponse should be: ${testCase.MoovitResponse}`);
	addContext(test, "Parameters:");
	addContext(test, JSON.stringify(testCase, null, "   "));
}
