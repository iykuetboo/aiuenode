class Game {
    constructor(emitter) {
        this._player_num = 0;
        this._state = "standby";
        this._emitter = emitter;
    }

    action(p_i,data){
        const msg = `player${p_i} sent action ${data.action}`
        console.log(msg)
        this._emitter.emit("system-msg",msg)
    }
}

module.exports = { Game, Game }