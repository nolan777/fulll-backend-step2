import { Vehicle } from "../../Domain/models/vehicle";

export class AddVehicleToFleetCommand {
    constructor(public fleetId: number, public vehiclePlateNumber: Vehicle) { }

    public static create(fleetId: number, vehiclePlateNumber: Vehicle) {
        const command = new AddVehicleToFleetCommand(fleetId, vehiclePlateNumber);
        return command;
    }

}