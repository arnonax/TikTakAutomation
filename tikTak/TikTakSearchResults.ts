import { TitTakResult } from "./TitTakResult";

export class TikTakSearchResults {
  get tikTakResult(): TitTakResult {
    return new TitTakResult();
  }

  constructor(responseData: any) {
    throw new Error("NotImplementedException");
  }
}
