export class CreateFleetCommand {
    constructor(public userId: number) { }

    public static create(userId: number) {
        const command = new CreateFleetCommand(userId);
        return command;
    }
}