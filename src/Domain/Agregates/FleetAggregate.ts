import { AddVehicleToFleetCommand } from "../../App/Commands/AddVehicleToFleetCommand";
import { CreateFleetCommand } from "../../App/Commands/CreateFleetCommand";
import { ParkVehicleCommand } from "../../App/Commands/ParkVehicleCommand";
import { Fleet } from "../models/fleet";

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('fleet.db');
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS fleets (id INT PRIMARY KEY, userId INT, vehicles TEXT[])`);
    db.run(`CREATE TABLE IF NOT EXISTS vehicles (plateNumber TEXT PRIMARY KEY, fleetID INT, FOREIGN KEY (fleetID) REFERENCES fleets(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS localization (plateNumber TEXT, fleetID INT, lat REAL, lng REAL, FOREIGN KEY (plateNumber) REFERENCES vehicles(plateNumber), FOREIGN KEY (fleetID) REFERENCES fleets(id))`);
});

const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

export class FleetAggregate {

    constructor() { }

    createFleet(command: CreateFleetCommand) {
        const fleetId = generateId();
        const fleet = new Fleet(fleetId, command.userId);
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO fleets (id, userId) VALUES (?, ?)`, [fleet.id, fleet.userId], (err: any) => {
                if (err) reject(err);
                else resolve(fleetId);
            });
        });
    }

    getFleetById(id: string) {
        return new Promise((resolve, reject) => {
            db.run(`SELECT id FROM fleets WHERE id = ?`, [id], (err: any) => {
                if (err) reject(err);
                else resolve(id);
            });
        });
    }

    addVehicleToFleet(command: AddVehicleToFleetCommand) {
        const fleetExists = new Promise((resolve, reject) => {
            db.run(`SELECT id FROM fleets WHERE id = ?`, [command.fleetId], (err: any) => {
                if (err) reject(err);
                else resolve(command.fleetId);
            });
        });
        if (!fleetExists) {
            throw new Error('Fleet not found.');
        }
        const fleetHasVehicle = new Promise((resolve, reject) => {
            db.run(`SELECT vehicles FROM fleets WHERE id = ? AND ? = ANY (vehiclePlateNumber) `, [command.fleetId, command.vehiclePlateNumber], (err: any) => {
                if (err) reject(err);
                else resolve(command.vehiclePlateNumber);
            });
        });
        if (!fleetHasVehicle) {
            return new Promise<void>((resolve, reject) => {
                db.run(`UPDATE fleets SET vehiclesPlateNumber = array_append(vehiclesPlateNumber, ?) WHERE id = ?`, [command.vehiclePlateNumber, command.fleetId], (err: any) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        } else {
            throw new Error('Vehicle already registered in the fleet.');
        }
    }

    parkVehicle(command: ParkVehicleCommand) {
        const fleetExists = new Promise((resolve, reject) => {
            db.run(`SELECT fleetId FROM vehicles WHERE id = ?`, [command.fleetId], (err: any) => {
                if (err) reject(err);
                else resolve(command.fleetId);
            });
        });
        if (!fleetExists) {
            throw new Error('Fleet not found.');
        }
        const vehicleExists = new Promise((resolve, reject) => {
            db.run(`SELECT plateNumber FROM vehicles WHERE plateNumber = ?`, [command.vehiclePlateNumber], (err: any) => {
                if (err) reject(err);
                else resolve(command.vehiclePlateNumber);
            });
        });
        if (!vehicleExists) {
            throw new Error('Vehicle not found.');
        }
        const vehicleAlreadyParked = new Promise<void>((resolve, reject) => {
            db.run(`SELECT plateNumber FROM localization WHERE plateNumber = ?`, [command.vehiclePlateNumber], (err: any) => {
                if (err) reject(err);
                else resolve();
            });
        });
        if (!vehicleAlreadyParked) {
            return new Promise<void>((resolve, reject) => {
                db.run(`INSERT INTO localization (plateNumber, fleetId, lat, lng) VALUES (?, ?, ?, ?)`, [command.vehiclePlateNumber, command.fleetId, command.localization.latitude, command.localization.longitude], (err: any) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        } else {
            return new Promise<void>((resolve, reject) => {
                db.run(`UPDATE localization SET (lat, lng) WHERE plateNumber = ? AND fleetId = ?`, [command.vehiclePlateNumber, command.fleetId], (err: any) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }
    }
}