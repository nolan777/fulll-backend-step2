import { FleetAggregate } from "../../Domain/Agregates/FleetAggregate";
import { AddVehicleToFleetCommand } from "../Commands/AddVehicleToFleetCommand";
import { CreateFleetCommand } from "../Commands/CreateFleetCommand";
import { ParkVehicleCommand } from "../Commands/ParkVehicleCommand";

export class FleetCommandHandler {
    private fleetAggregate: FleetAggregate;

    constructor() {
        this.fleetAggregate = new FleetAggregate();
    }

    handleCreateFleet(command: CreateFleetCommand) {
        this.fleetAggregate.createFleet(command);
    }

    handleAddVehicleToFleet(command: AddVehicleToFleetCommand) {
        this.fleetAggregate.addVehicleToFleet(command);
    }

    handleParkVehicle(command: ParkVehicleCommand) {
        this.fleetAggregate.parkVehicle(command);
    }
}