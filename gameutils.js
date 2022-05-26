const initial_board = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 'x', 0, 'x', 0], [0, 0, 0, 0, 0], [0, 0, 0, 'x', 0]]

class Game {
    constructor(emitter, player_names) {
        this._player_num = player_names.length;
        this._player_names = player_names;
        this._state = "standby";
        this._emitter = emitter;
        this._state = { "state": "beginning", "player_names": this.player_names, "board": initial_board }
    }

    action(p_i, data) {
        const msg = `player${p_i} sent action ${data.action}`
        console.log(msg)
        this._emitter.emit("system-msg", msg)
    }

    get state() { return this._state; }
}

module.exports = { Game, Game }