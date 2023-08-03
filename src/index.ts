const { program } = require('commander');
const inquirer = require('inquirer');
import { FleetCommandHandler } from "./App/CommandHandlers/FleetCommandHandler";
import { Vehicle } from "./Domain/models/vehicle";

const FleetCommand = new FleetCommandHandler;

program.version('1.0.0');

program
    .command('create <userId>')
    .description('Create a fleet for a user')
    .action(async (userId: number) => {
        const fleetId = FleetCommand.handleCreateFleet({ userId });
        console.log(`Fleet created with id : ${fleetId}`);
    });

program
    .command('register-vehicle <fleetId> <vehiclePlateNumber>')
    .description('Register a vehicle in a fleet')
    .action(async (fleetId: number, vehiclePlateNumber: Vehicle) => {
        FleetCommand.handleAddVehicleToFleet({
            fleetId, vehiclePlateNumber,
        });
        console.log('Vehicle registered with success.');
    });

program
    .command('localize-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng> [alt]')
    .description('Park a vehicle in a fleet')
    .action(async (fleetId: number, vehiclePlateNumber: Vehicle, lat: number, lng: number) => {
        FleetCommand.handleParkVehicle({ fleetId, vehiclePlateNumber, localization: { latitude: lat, longitude: lng } });
        console.log('Vehicle parked with success.');
    });

program.parse(process.argv);