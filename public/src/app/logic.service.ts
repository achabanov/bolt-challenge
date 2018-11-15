import { Injectable } from "@angular/core";
import { DriversService } from "./drivers.service";
import { ShipmentsService } from "./shipments.service";
import { HttpService } from "./http.service";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import "rxjs/add/observable/interval";

const interval = 10000;

@Injectable({
  providedIn: "root"
})
export class LogicService {
  arrayShipments: any;
  shipmentLocation: any;
  sub: any;
  shipmentCounter = [];
  currentlyDispatching = []; // for front end
  processedShipmentChange: Subject<any> = new Subject<any>();
  processedShipment: any;
  allDoneObs: Subject<any> = new Subject<any>();

  constructor(
    private drivers: DriversService,
    private shipments: ShipmentsService,
    private _http: HttpService
  ) {
    this.processedShipment = [];
  }

  change() {
    this.processedShipment = this.currentlyDispatching;
    this.processedShipmentChange.next(this.currentlyDispatching);
  }

  dispatch() {
    this.currentlyDispatching = [];
    this.shipmentCounter = [];
    this.sub = Observable.interval(interval).subscribe(t =>
      this.dispatchService(this.arrayShipments)
    );
  }

  // for each shipment add key-value pair - list of all drivers AND add key-val Status: "Available" or "Taken"
  // If shipment's status: '  "available" : true ' move on
  // find 3 closest
  // pull them out of the shipment['drivers']
  // send POST request for each driver
  // if response form POST is "accepted" update this shipments Status to "Taken"
  // wait 10 seconds - when to send?
  // check back to step 2

  addDriversToShipment() {
    this.arrayShipments = this.shipments.getShipments();
    let drivers = this.drivers.getDrivers();
    for (var i = 0; i < this.arrayShipments.length; i++) {
      this.arrayShipments[i]["availableDrivers"] = drivers;
      this.arrayShipments[i]["available"] = true;
    }
  }

  getClosestDriver(shipmentLocation, locationData) {
    function vectorDistance(dx, dy) {
      return Math.sqrt(dx * dx + dy * dy);
    }
    function locationDistance(location1, location2) {
      var dx = location1.latitude - location2[1].coordinates.latitude,
        dy = location1.longitude - location2[1].coordinates.longitude;
      return vectorDistance(dx, dy);
    }
    return locationData.reduce(function(prev, curr) {
      let prevDistance = locationDistance(shipmentLocation, prev),
        currDistance = locationDistance(shipmentLocation, curr);
      return prevDistance < currDistance ? prev : curr;
    });
  }

  async dispatchService(arrayShipments) {
    for (var shipment of arrayShipments) {
      let drivers = this.getThreeClosest(shipment);
      for (var d of drivers) {
        let response = await this._http.doPost(shipment[0], d[0]);
        if (response === "Accepted") {
          this.currentlyDispatching.push([shipment[0], d[0], "Accepted"]); // Was added for front end
          this.change(); //  Was added for front end
          arrayShipments.splice(arrayShipments.indexOf(shipment), 1);
          if (arrayShipments.length == 0) {
            console.log("FINISHED");
            this.allDoneObs.next(true);
            this.sub.unsubscribe();
          }
          break;
        }
      }
      if (shipment.availableDrivers.length == 0) {
        this.shipmentCounter.push(shipment[0]);
        this.currentlyDispatching.push([shipment[0], "N/A", "Not Accepted"]); //  Was added for front end
        this.change(); // Was added for front end
        if (this.shipmentCounter.length == arrayShipments.length) {
          console.log("FINISHED");
          this.allDoneObs.next(true);
          this.sub.unsubscribe();
        }
      }
    }
  }

  getDriver(s) {
    var closest = this.getClosestDriver(s[1], s.availableDrivers);
    var removedClosest = s.availableDrivers.filter(function(e) {
      return e !== closest;
    });
    s.availableDrivers = removedClosest;
    return closest;
  }

  getThreeClosest(s) {
    let three = [];
    for (var k = 0; k < 3; k++) {
      if (s.availableDrivers.length > 0) {
        three.push(this.getDriver(s));
      }
    }
    return three;
  }
}
