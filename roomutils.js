class room {
    players = [];

    constructor(id) {
        this._id = id;
        // players = [];
        this._capacity = 6;
    }

    has_capacity() {
        return this._capacity - this.players.length > 0;
    }

    emit(io, key, data, exclude = null) {
        console.log(`r.emit() called: r=${this._id},players=${this.players},key=${key},data=${data}`);
        for (let p in this.players) {
            if (Array.isArray(exclude)) {
                if (p.socket_id in exclude) { continue; }
            } else {
                if (p.socket_id == exclude) { continue; }
            }

            console.log(`io.to(${p.socket_id}.emit(${key},${data}))`);
            io.to(p.socket_id).emit(key, data);
        }
    }

    /**
     * @param {player} p
     */
    set new_player(p){
        this.players.push(p)
    }

    get id(){return this._id;}
    // get players(){return this._players;}
}

class player {
    constructor(socket_id, name) {
        this._socket_id = socket_id;
        this._joined_room = null;
        this._name = name;
    }

    join(room) {
        console.log(`p.join(r) called: p=${this._socket_id},r=${room.id}`)
        if (room.has_capacity()) {
            this._joined_room = room;

            for (let p in room.players) {
                console.log("  check:"+p.socket_id+" "+this._socket_id)
                if (p.socket_id == this._socket_id) {
                    console.log(`warning! ${this._name} repeatedly joined to ${room.id}`);
                    break;
                }
            }
            // if(this in room.players){console.log(`warning! ${this._name} repeatedly joined to ${room.id}`)}

            room.new_player = this;
            return null;
        } else {
            const err = "capacity over...";
            return err;
        }
    }

    get joined_room(){return this._joined_room;}
    get socket_id(){return this._socket_id;}
    get name(){return this._name;}
}

module.exports = { room: room, player: player }