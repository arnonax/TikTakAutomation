import { TikTakApi } from "../tikTak/TikTakApi";
import { Configuration } from "../configuration/Configuration";
import configurationData from "../configuration/TestConfiguration.json";
import { TestCase } from "../TestData/TestCase";
import { Logger } from "../infrastructure/logger";
import { TravelResponse, TravelStateResponse } from "../typescript-node-client/api";
import locations from "../TestData/LocationsData.json";
import { LocationsList, Location } from "../TestData/LocationsList";
import { LocationTool } from "../TestData/LocationTool";

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

		// it(testCase.TestCase, async function () {
		// 	PrintTestConditions(this, Number(i), testData);
		// 	const travelOptions = await tikTakApi.getTravelOptions(
		// 		testCase.OriginLocation,
		// 		testCase.DestinationLocation
		// 	);

		// 	const status = travelOptions.getStatus();
		// 	expect(status).to.equal(testCase.ServerCodeExpected);
		// });
	}

	it("Book new Travel", async function () {
		// Arrange
		const isDriverActivated = await readlineSync.question(
			"Please activate the Driver, insert 'y' and press Enter\n"
		);
		if (isDriverActivated == false) {
			throw Error("Driver should be activated!");
		}
		const locationsList: LocationsList = JSON.parse(JSON.stringify(locations));
		const origin: Location = LocationTool.GetLocationByTitle(locationsList, "OriginUserLocation");
		const destination: Location = LocationTool.GetLocationByTitle(locationsList, "DestinationUserLocation");
		LocationTool.PrintLocations(origin, destination);

		const travelOptions = await tikTakApi.getTravelOptions(origin.LatLong, destination.LatLong);
		const status = travelOptions.getStatus();
		const requestId = travelOptions.requestId;
		await tikTakApi.waitUntilValidForBooking(requestId);

		// Act
		const bookMeTravelResponse: TravelResponse = await tikTakApi.bookMeTravel(requestId);
		Logger.logMessage(`BookMe TravelId: ${bookMeTravelResponse.travelId}`);
		Logger.logMessage(`bookMeTravelResponse: ${JSON.stringify(bookMeTravelResponse)}`);

		//let travelStateResponse = await tikTakApi.getTravelState();
		let travelStateResponse = await tikTakApi.waitUntilTravelState("scheduled.assigned");
		Logger.logMessage(`TravelStateResponse State: ${JSON.stringify(travelStateResponse)}`);

		// Assert
		expect(bookMeTravelResponse.travelId).to.not.be.an("undefined");
		expect(travelStateResponse.state.state).to.equal("scheduled.assigned");
	});
});

function PrintTestConditions(test: any, i: number, testData: TestCase[]) {
	const testCase = testData[i];
	console.log(`\nTest Case number ${i}: MoovitResponse should be: ${testCase.MoovitResponse}`);
	addContext(test, "Parameters:");
	addContext(test, JSON.stringify(testCase, null, "   "));
}
