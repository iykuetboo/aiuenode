
const gameutils = require('./gameutils');
const Game = gameutils.Game;

class Room {
    constructor(id) {
        this._id = id;
        this._players = [];
        this._capacity = 4;
        this._game = new Game(this)
        
        if (typeof Room.dict == 'undefined') {
            Room.dict = {}
        }
        Room.dict[id] = this;
    }

    remain_capacity() {
        return this.capacity - this.players.length > 0;
    }

    emit(key, data, except_ids = []) {
        if (!Array.isArray(except_ids)) {
            except_ids = [except_ids]
        }

        this.players
            .filter(p => !(p.socket_id in except_ids))
            .map(p => { Room.io.to(p.socket_id).emit(key, data) });
    }

    remove_player(p) {
        if (this.players.find(v => v.socket_id == p.socket_id)) {
            this._players = this.players.filter(v => v.socket_id != p.socket_id)
            return null
        } else {
            const err = {
                code: "application eroor",
                msg: `Player:${p.socket_id} to be removed is not in Room:${this.id}.`
            }
            return err;
        }
    }

    player_index(p) {
        return this.players.indexOf(p);
    }

    game_action(p,data){
        const p_i = this.player_index(p)
        this._game.action(p_i,data)
    }

    static set_io(io) {
        Room.io = io
    }
    static get(id) {
        if (typeof Room.dict == 'undefined' || !(id in Room.dict)) {
            return new Room(id)
        }
        else {
            return Room.dict[id]
        }
    }

    get players() { return this._players; }
    get id() { return this._id; }
    get capacity() { return this._capacity }
}

class Player {
    constructor(socket_id) {
        this._socket_id = socket_id;
        this._joined_room = null;
        this._name = null;
        if (typeof Player.dict == 'undefined') {
            Player.dict = {}
        }
        Player.dict[socket_id] = this;
    }

    join(room) {
        let err;
        if (this.joined_room != null) {
            err = {
                code: "application eroor",
                msg: `Player:${this._socket_id} has already joined to Room:${this.joined_room}. players can only be in one room at a time.`
            }
            return err;
        }

        if (room.remain_capacity() == false) {
            err = {
                code: "over capacity",
                msg: `Room:${r.id} is fully occupied. Please join other room.`
            }
            return err;
        }

        this._joined_room = room.id;
        room.players.push(this);

        return null
    }

    exit() {
        let err;
        if (this.joined_room == null) {
            err = {
                code: "application eroor",
                msg: `Player:${this._socket_id} is not in any rooms.`
            }
            return err;
        }

        const r = Room.get(this.joined_room)

        err = r.remove_player(this)
        if (err) {
            return err
        }
        this._joined_room = null
        console.log(`Player:${this.socket_id} is removed from Room:${r.id}`)
    }

    static get(socket_id) {

        if (typeof Player.dict == 'undefined' || !(socket_id in Player.dict)) {
            return new Player(socket_id)
        }
        else {
            return Player.dict[socket_id]
        }
    }

    get joined_room() { return this._joined_room; }
    get socket_id() { return this._socket_id; }
    get name() { return this._name; }
    set name(v) { this._name = v }
}

// function join(r,p){
//     console.log(p)

//     if(p.joined_room!=null){
//         err = {
//             code:"application eroor",
//             msg:`Player:${p.name} is already joined to Room:${r.id}. players can only be in one room at a time.`
//         }
//         return err;
//     }

//     if(r.remain_capacity()==false){
//         err = {
//             code:"over capacity",
//             msg:`Room:${r.id} is fully occupied. Please join other room.`
//         }
//         return err;
//     }

//     p.joined_room = r.id;
//     r.players.push(p);

//     return null
// }

// function emit(r,key,data,except_ids=[]){
//     // console.log(r)
//     console.log(r.players)
//     // console.log(`emit in room ${r.id}: key=${key}, data=${data}, players=${r.players}`)

//     if(!Array.isArray(except_ids)){
//         except_ids = [except_ids]
//     }

//     r.players.filter(p=>!(p.socket_id in except_ids))
//         .map(p => {
//             r.io.to(p.socket_id).emit(key,data)
//         });
// }

module.exports = { Room: Room, Player: Player }