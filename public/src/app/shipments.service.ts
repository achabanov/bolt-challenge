import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ShipmentsService {
  constructor() {}

  getShipments() {
    var obj = {
      "65289023243": {
        coordinates: {
          latitude: 34.009,
          longitude: -118.289
        }
      },
      "3823958290": {
        coordinates: {
          latitude: 34.0375,
          longitude: -118.249
        }
      },
      "2352839523": {
        coordinates: {
          latitude: 34.036,
          longitude: -118.39
        }
      },
      "1212423524": {
        coordinates: {
          latitude: 33.938,
          longitude: -118.363
        }
      },
      "93825298323": {
        coordinates: {
          latitude: 33.991,
          longitude: -118.425
        }
      }
    };
    return Object.keys(obj).map(function(key) {
      return [Number(key), obj[key]];
    });
  }
}
