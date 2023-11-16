class PlayerObj {
    constructor(id, name) {
        // the playerId
        this.id = id;

        // the players name
        this.name = name;

        // the players ready state
        this.ready = false;

        // the players role/secret
        this.role = "pending";
    }
}

export default PlayerObj;
