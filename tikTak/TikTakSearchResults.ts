import { TitTakResult } from "./TitTakResult";

export class TikTakSearchResults {
  private _responseData: any;

  hasTikTakResult(): boolean {
    return this._responseData.data.travelOptions !== undefined;
  }
  get tikTakResult(): TitTakResult {
    return new TitTakResult();
  }

  constructor(responseData: any) {
    this._responseData = responseData;
  }
}
