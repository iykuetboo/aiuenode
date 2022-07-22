
class Game {
    constructor(emitter, players) {
        this._players = players
        this._player_words = Array.from(Array(players.length), (v, k) => "xxxxxxxx")
        this._player_stellas = Array.from(Array(players.length), (v, k) => 0)
        this._public_words = Array.from(Array(players.length), (v, k) => "????????")
        this._state = "set-words";
        this._emitter = emitter;
        this._player_defeat_state = Array.from(Array(players.length), (v, k) => 0) // 0 for default, 1-4 for defeated order, 100 for retired
        this._remain_player_number = players.length
        this._board = {}
        this._waiting = Array.from(Array(players.length), (v, k) => k + 1);
        this.initialize();
    }

    static kana = Array.from("あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんー")
    static valid_actions = {
        "set-theme": ["set-theme"],
        "set-words": ["set-word"],
        "main-loop": ["attack"],
        "wait-restart": ["restart"],
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

        // const msg = `player${p_i} (${p.id}) sent action ${data.action}`
        // console.log(msg)
        // this._emitter.emit("system-msg", msg)

        switch (data.action) {
            case "set-thema":
                break;

            case "set-word":
                this.set_word_action(p, data.word)
                break;

            case "attack":
                this.attack_action(p, data.value)
                break;

            case "restart":
                this.restart_action(p, data.value)
                break
        }

        console.log(`waiting: ${this._waiting}`)
    }

    initialize() {
        console.log(`initialize()`)

        this._player_defeat_state = Array.from(Array(this._players.length), (v, k) => 0) // 0 for default, 1-4 for defeated order, 100 for retired
        this._board = {}
        Game.kana.forEach(v => {
            this._board[v] = 0;
        });

        this.start_set_words()

        this.emit_info()
    }

    start_set_words() {
        this._state = "set-words"
        this._emitter.emit("set-word-start")
        this._player_words = Array.from(Array(this._players.length), (v, k) => "xxxxxxxx")
        this._public_words = Array.from(Array(this._players.length), (v, k) => "????????")
        this._waiting = Array.from(Array(this._players.length), (v, k) => k + 1);
        this._state = "set-words";
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

        this._player_words[p_i - 1] = word_extended;
        console.log(`player${p_i}'s word is ${this._player_words[p_i - 1]}`)
        this._emitter.to(p.id).emit("set-word-ok")

        this._waiting = this._waiting.filter(v => v != p_i)
        if (this._waiting.length == 0) {
            this.start_main_loop();
        }
    }


    start_main_loop() {
        console.log("start main-loop")
        this._state = "main-loop"
        this._emitter.emit("start-main-loop", {})
        this._waiting = [1]
        this._emitter.emit("turn-change", { index: 1, name: this._players[0].name })
    }

    attack_action(p, char) {
        const p_i = this.player_index(p)

        this._board[char] = p_i

        this.update_public_words()

        this.emit_info()

        const end = this.check_defeated()

        if(end){return;}

        let p_i_next = (p_i) % this._players.length + 1

        // console.log(`attack_action: p_i_next=${p_i_next}`)
        //skip defeated player
        while(this._player_defeat_state[p_i_next-1] != 0){
            p_i_next = (p_i_next) % this._players.length + 1
            // console.log(`      skipped: p_i_next=${p_i_next}`)
        }

        this._waiting = [p_i_next]
        this._emitter.emit("turn-change", { index: p_i_next, name: this._players[p_i_next - 1].name })
    }

    update_public_words() {
        this._public_words = []
        for (let i = 0; i < this._players.length; i++) {
            let remains = 0
            let a = "";
            Array.from(this._player_words[i]).forEach(c => {
                if (this._board[c] == 0) { remains += 1; }
                a += (this._board[c] > 0) ? c : "?"
            })
            if (remains == 0) { a = this._player_words[i] }
            this._public_words.push(a)
        }
    }

    check_defeated() {
        console.log(`check_defeated: ${this._public_words}`)

        for (let i = 0; i < this._players.length; i++) {
            if (this._player_defeat_state[i] == 0) {
                if (this._public_words[i].indexOf("?") == -1) {
                    this._player_defeat_state[i] = this._remain_player_number
                    console.log(`player${i+1} defeated: defeat_state=${this._player_defeat_state[i]}`)
                }
            }
        }
        this._remain_player_number = this._player_defeat_state.filter(v => v == 0).length

        if (this._remain_player_number <= 1) {
            this.finish_game()
            return true
        }
        
        return false
    }

    finish_game() {
        console.log("finish_game")
        let ranking = [];
        let rankmin = this._players.length
        for (let i = 0; i < this._players.length; i++) {
            let rank = 0;
            if(this._player_defeat_state[i]==0){
                rank = 1
            }else{
                rank = this._player_defeat_state[i]
            }
            ranking.push({ "rank": rank, "player": this._players[i], "p_i": i + 1 })
            if(rankmin>rank){
                rankmin = rank
            }
        }

        ranking.forEach((v,i)=>{v["rank"]=v["rank"]-rankmin+1})
        
        ranking.forEach(v=>{
            this._player_stellas[v.p_i-1] += this._player_words.length -  v["rank"]
        })
        // argsort(this._player_defeat_state).forEach((defeat,index) => {
        //     this._player_stellas[index] += defeat
        //     ranking.push({ "rank": this._player_words.length - defeat, "player": this._players[index], "p_i": index + 1 })
        //     console.log(`rank=${this._player_words.length - defeat}, player${this._players[index]}, p_i=${index +  1}`)
        // })

        ranking.sort((a, b) => {
            if (a["rank"] < b["rank"]) {
                return -1;
            }
            if (a["rank"] > b["rank"]) {
                return 1;
            }
            return 0;
        });
        
        this._emitter.emit("game-finish", ranking)
        this.emit_info()
        this._waiting = Array.from(Array(this._players.length), (v, k) => k + 1);
        this._state = "wait-restart"
    }

    restart_action(p, data) {
        const p_i = this.player_index(p)
        this._emitter.to(p.id).emit("restart ok. waiting other players")

        this._waiting = this._waiting.filter(v => v != p_i)
        if (this._waiting.length == 0) {
            this.initialize();
        }
    }

    emit_info() {
        this._emitter.emit("game-info", this.info)
        // console.log(this.info)
    }

    get info() { return { state: this._state, board: this._board, players: this._players, public_words: this._public_words ,stellas:this._player_stellas}; }
}

function argsort(array) {
    const arrayObject = array.map((value, idx) => { return { value, idx }; });
    arrayObject.sort((a, b) => {
        if (a.value < b.value) {
            return 1;
        }
        if (a.value > b.value) {
            return -1;
        }
        return 0;
    });
    const argIndices = arrayObject.map(data => data.idx);
    return argIndices;
}

module.exports = { Game, Game }