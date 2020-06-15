import { TikTakApi } from "../tikTak/TikTakApi";
import configuration from "../configuration/TestConfiguration.json";
import Papa from "papaparse";
import { readFileSync } from "fs";

var expect = require("chai").expect;

class TestCase {
  TestCase: string = "";
  MoovitResponse: string = "";
  ServerCodeExpected: string = "";
  Conditions: string = "";
  OriginLocation: string = "";
  DestinationLocation: string = "";
}

describe("Sanity tests", () => {
  const tikTakApi = new TikTakApi(
    configuration.tikTakBaseUrl,
    configuration.apiKey
  );
  const testCasesFile = readFileSync(
    configuration.testCasesCsvFilePath,
    "utf8"
  );
  const results = Papa.parse<TestCase>(testCasesFile, {
    header: true,
  });

  const testData = results.data;

  for (const i in testData) {
    const testCase = testData[i];
    console.log(i + ":  " + testCase.TestCase);
    console.log(i + ":  " + testCase.MoovitResponse);
    console.log(i + ":  " + testCase.ServerCodeExpected);
    console.log(i + ":  " + testCase.Conditions);
    console.log(i + ":  " + testCase.OriginLocation);
    console.log(i + ":  " + testCase.DestinationLocation);

    it(testCase.TestCase, async () => {
      PrintTestConditions(i, testData);
      const routes = await tikTakApi.searchRoutes(
        testCase.OriginLocation,
        testCase.DestinationLocation
      );
      const tikTakResult = routes.tikTakResult;
      const titTakStatus = tikTakResult.titTakStatus;
      expect(titTakStatus).to.equal(testCase.ServerCodeExpected);
    });
  }
});

function PrintTestConditions(i: string, testData: any) {
  console.log(
    "Test Case number " +
      i +
      " MoovitResponse should be: " +
      testData[i].MoovitResponse
  );
}
