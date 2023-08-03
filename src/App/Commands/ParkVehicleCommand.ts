import { Localization } from "../../Domain/models/localization";
import { Vehicle } from "../../Domain/models/vehicle";

export class ParkVehicleCommand {
    constructor(public fleetId: number, public vehiclePlateNumber: Vehicle, public localization: Localization) { }

    public static create(fleetId: number, vehiclePlateNumber: Vehicle, localization: Localization) {
        const command = new ParkVehicleCommand(fleetId, vehiclePlateNumber, localization);
        return command;
    }
}