import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  body: any;
  constructor(private http: Http) {}

  async doPost(shipmentId, driverID): Promise<string> {
    this.body = {
      shipmentId: parseInt(shipmentId)
    };
    const response = await this.http
      .post(
        `http://challenge.shipwithbolt.com/driver/${driverID}/dispatch`,
        this.body
      )
      .toPromise();
    return response.json().response;
  }
}
