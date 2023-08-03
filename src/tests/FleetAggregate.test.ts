// Importer les dépendances et classes nécessaires pour les tests
import { AddVehicleToFleetCommand } from "../App/Commands/AddVehicleToFleetCommand";
import { CreateFleetCommand } from "../App/Commands/CreateFleetCommand";
import { ParkVehicleCommand } from "../App/Commands/ParkVehicleCommand";
import { FleetAggregate } from "../Domain/Agregates/FleetAggregate";
import { Localization } from "../Domain/models/localization";
import { Vehicle } from "../Domain/models/vehicle";

// Tests pour FleetAggregate
describe('FleetAggregate', () => {
    let fleetAggregate = new FleetAggregate;

    beforeEach(() => {
        fleetAggregate = new FleetAggregate();
    });

    it('should create a fleet', () => {
        const fleetId = 'fleet1';
        const createFleetCommand = new CreateFleetCommand(fleetId);

        fleetAggregate.createFleet(createFleetCommand);

        // Vérifiez si la flotte a été créée avec succès
        expect(fleetAggregate.getFleetById(fleetId)).toBeDefined();
    });

    it('should add a vehicle to a fleet', () => {
        const fleetId = 'fleet1';
        const vehicleId = 'vehicle1';
        const vehicle = new Vehicle(vehicleId, 'car');
        const addVehicleCommand = new AddVehicleToFleetCommand(fleetId, vehicle);

        fleetAggregate.createFleet(new CreateFleetCommand(fleetId));
        fleetAggregate.addVehicleToFleet(addVehicleCommand);

        // Vérifiez si le véhicule a été ajouté à la flotte
        expect(fleetAggregate.getFleetById(fleetId)?.hasVehicle(vehicle)).toBe(true);
    });

    it('should park a vehicle successfully', () => {
        const fleetId = 'fleet1';
        const vehicleId = 'vehicle1';
        const vehicle = new Vehicle(vehicleId, 'car');
        const location = new Localization(45.12345, -75.6789);
        const parkVehicleCommand = new ParkVehicleCommand(fleetId, vehicleId, location);

        fleetAggregate.createFleet(new CreateFleetCommand(fleetId));
        fleetAggregate.addVehicleToFleet(new AddVehicleToFleetCommand(fleetId, vehicle));
        fleetAggregate.parkVehicle(parkVehicleCommand);

        // Vérifiez si le véhicule a été correctement stationné
        expect(vehicle.getParkingLocalization()).toEqual(location);
    });
});