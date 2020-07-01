import { Logger } from "../infrastructure/logger";
import { Location, LocationsList } from "./LocationsList";

export class LocationTool {
	static GetLocationByTitle(locationsList: LocationsList, title: string): Location {
		return locationsList.Locations.find((l) => l.Title == title)!;
	}
	static PrintLocations(origin: Location, destination: Location) {
		Logger.logMessage(
			`User's Origin: ${JSON.stringify(origin)}, \n User's Destination: ${JSON.stringify(destination)}`
		);
	}
}
