class room {
    constructor(id,io) {
        this._id = id;
        this._players = [];
        this._capacity = 6;
        this._io = io;
    }

    remain_capacity() {
        return this.capacity - this.players.length > 0;
    }

    emit(key,data,except_ids=[]){

        if(!Array.isArray(except_ids)){
            except_ids = [except_ids]
        }
    
        this.players
            .filter(p=>!(p.socket_id in except_ids))
            .map(p => {this.io.to(p.socket_id).emit(key,data)});
    }

    get players(){return this._players;}
    get id(){return this._id;}
    get capacity(){return this._capacity}
    get io(){return this._io;}
}

class player {
    constructor(socket_id, name) {
        this._socket_id = socket_id;
        this._joined_room = null;
        this._name = name;
    }

    get joined_room(){return this._joined_room;}
    set joined_room(v){this._joined_room = v}
    get socket_id(){return this._socket_id;}
    get name(){return this._name;}
}

function join(r,p){
    console.log(p)
    
    if(p.joined_room!=null){
        err = {
            code:"application eroor",
            msg:`Player:${p.name} is already joined to Room:${r.id}. players can only be in one room at a time.`
        }
        return err;
    }

    if(r.remain_capacity()==false){
        err = {
            code:"over capacity",
            msg:`Room:${r.id} is fully occupied. Please join other room.`
        }
        return err;
    }
    
    p.joined_room = r.id;
    r.players.push(p);
    p.name = "aaaaaaaaaaaaaaaa"
    console.log(r.players)
    console.log(p.name)

    return null
}

function emit(r,key,data,except_ids=[]){
    // console.log(r)
    console.log(r.players)
    // console.log(`emit in room ${r.id}: key=${key}, data=${data}, players=${r.players}`)

    if(!Array.isArray(except_ids)){
        except_ids = [except_ids]
    }

    r.players.filter(p=>!(p.socket_id in except_ids))
        .map(p => {
            r.io.to(p.socket_id).emit(key,data)
        });
}

module.exports = { room: room, player: player ,join: join, emit:emit}