
class Game {
    constructor(emitter, players) {
        this._players = players
        this._player_words = Array.from(Array(players.length), (v, k) => "xxxxxxxx")
        this._public_words = Array.from(Array(players.length), (v, k) => "????????")
        this._state = "set-words";
        this._emitter = emitter;
        this._board = {}
        Game.kana.forEach(v => {
            this._board[v] = 0;
        });
        this._waiting = Array.from(Array(players.length), (v, k) => k + 1);

        this.start_set_words()
    }

    static kana = Array.from("あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんー")
    static valid_actions = {
        "set-theme": ["set-theme"],
        "set-words": ["set-word"],
        "main-loop": ["attack"],
    }

    player_index(p) { return this._players.indexOf(p) + 1; }

    action(p, data) {
        const p_i = this.player_index(p)

        if (!this._waiting.some(v => p_i == v)) {
            console.log(`${data.action} from player${p_i} (${p.id}) is not waited...`)
            return
        }
        if (!Game.valid_actions[this._state].includes(data.action)) {
            console.log(`${data.action} from player${p_i} (${p.id}) is not valid action (state=${this._state})...`)
            return
        }

        const msg = `player${p_i} (${p.id}) sent action ${data.action}`
        console.log(msg)
        this._emitter.emit("system-msg", msg)

        switch (data.action) {
            case "set-thema":
                break;

            case "set-word":
                this.set_word_action(p, data.word)
                break;

            case "attack":
                this.attack_action(p,data.value)
                break;


        }
    }

    start_set_words() {
        this._state = "set-words"
        this._emitter.emit("set-word-start")
    }

    set_word_action(p, word) {
        const p_i = this.player_index(p)

        if (word.length > 8 || word.length <= 0) {
            this._emitter.to(p.id).emit("set-word-ng")
            return
        }

        let word_extended = word;
        for (let i = 0; i < 8 - word.length; i++) {
            word_extended += "x"
        }

        this._player_words[p_i] = word_extended;
        console.log(`player${p_i}'s word is ${this._player_words[p_i]}`)
        this._emitter.to(p.id).emit("set-word-ok")

        this._waiting = this._waiting.filter(v=>v!=p_i)
        console.log(`waiting: ${this._waiting}`)
        if(this._waiting.length==0){
            this.start_main_loop();
        }
    }

        
    start_main_loop() {
        console.log("start main-loop")
        this._state = "main-loop"
        this._emitter.emit("start-main-loop",{})
        this._waiting = [1]
        this._emitter.emit("turn-change",{index:1,name:this._players[0].name})
    }

    attack_action(p,char){
        const p_i = this.player_index(p)

        this._board[char] = p_i

        console.log(this._board)
        const p_i_next = (p_i)%this._players.length + 1
        this._waiting = [p_i_next]
        this._emitter.emit("turn-change",{index:p_i_next,name:this._players[p_i_next-1].name})
    }

    get info() { return { state: this._state, board: this._board, players: this._players, words: this._public_words }; }
}

module.exports = { Game, Game }