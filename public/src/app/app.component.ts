import { Component } from "@angular/core";
import { LogicService } from "./logic.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "BOLT";
  _subscription: any;
  _subscriptionDispatching: any;
  dispatching: boolean;

  processedShipment: any;

  constructor(private logic: LogicService) {
    this.processedShipment = logic.processedShipment;
    this._subscription = logic.processedShipmentChange.subscribe(value => {
      this.processedShipment = value;
    });

    this._subscriptionDispatching = logic.allDoneObs.subscribe(value => {
      this.dispatching = false;
    });
  }

  dispatchAll() {
    console.log("Starting to dispatch...");
    this.logic.addDriversToShipment();
    this.logic.dispatch();
    this.processedShipment = [];
    this.dispatching = true;
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._subscriptionDispatching.unsubscribe();
  }
}
