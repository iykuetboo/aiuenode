
update_view("roomselect")
let selected = null
let state = "set-word"
let myword = ""
let p_i = 0;

function update_view(v) {
    $('.switch-view').each(function (index, element) {
        if ($(element).hasClass(v)) {
            $(element).removeClass("hide");
        }
        else {
            $(element).addClass("hide");
        }
    })
}

$(".aiue-line > .aiue-button").click(function () {

    if ($(this)[0].classList.contains("interact")) {
        switch (state) {
            case "set-word":
                if (myword.length < 8) {
                    myword += $(this)[0].name
                }
                render_mywords(myword)
                break

            case "attack":
                if (selected) {
                    selected.classList.remove("selected");
                }
                selected = $(this)[0];
                $(this)[0].classList.add("selected");
                console.log(`aiue-button ${selected.name} clicked`);
                break
        }
    }
})

$("#backspace-button").on("click", () => {
    switch (state) {
        case "set-word":
            if (myword.length != 0) {
                myword = myword.slice(0, -1)
            }
            render_mywords(myword)
            break
        default:
            $("#backspace-button").addClass("hide")
    }
}
)


$("#attack-button").on("click", () => {
    switch (state) {
        case "set-word":
            socket.emit("game", { action: 'set-word', word: myword })

        case "attack":
            if (selected) {
                console.log(`attack-button clicked: selected = ${selected.name}`);
                socket.emit("game", { action: `attack`, value: selected.name })
                selected.classList.remove("selected");
                selected = null;
            }
            break
    }

})

$("#ready-button").on("click", () => {
    $(this).toggleClass("is-ready")
    console.log(`ready-button clicked`);
    socket.emit("ready", {})
})


function render_mywords(word) {
    console.log(`render_mywords ${word}`)
    $("#my-word .aiue-char").each((i, e) => {
        if (i < word.length) {
            e.innerHTML = word.charAt(i)
        } else {
            e.innerHTML = "×"
        }
    });
}

function set_gamestatus_message(msg) {
    $(".game-status").each((i, e) => {
        e.innerHTML = msg
    });
}


function set_players_info(players, public_words, stellas) {
    $(".player-item").each((i, e) => {
        console.log($(e).find(".player-name"))
        console.log(public_words)
        if (i < players.length) {
            $(e).removeClass("hide")
            $(e).find(".player-name").html(players[i]._name);
            $(e).find(".player-stella-number").html(stellas[i]);
            $(e).find(".aiue-button").each((j, v) => {
                const c = public_words[i].charAt(j)
                v.innerHTML = `<span class="aiue-char">${c}</span>`
                if (c != "?") {
                    $(v).addClass("reverse-color")
                } else {
                    $(v).removeClass("reverse-color")
                }
            });
        } else {
            $(e).addClass("hide")
        }
    })
}


function set_board(board) {
    console.log("set_board")
    $(".aiue-board .aiue-button").each((i, e) => {
        const c = e.name;
        switch (board[c]) {
            case 0:
                e.innerHTML = `<span class="aiue-char">${c}</span>`;
                $(e).removeClass("disabled");
                break;
            case "x":
            case undefined:
                e.innerHTML = `<span class="aiue-char"> </span>`;
                $(e).addClass("disabled");
                $(e).addClass("no-border");
                break;
            default:
                e.innerHTML = `<span class="aiue-char player${board[c]}">${c}</span>`;
                $(e).addClass("disabled");
        }
    })
}

function set_interaction(q, val) {
    console.log("set_interaction")
    q.each((i, e) => {
        if (val == true && $(e).hasClass("disabled") == false && e.name != "x") {
            $(e).addClass("interact");
        } else {
            $(e).removeClass("interact");
        }
    })
}





document.addEventListener('keypress', keypress_ivent);

function keypress_ivent(e) {
    if (e.code === 'KeyA') {
        //Aキーが押された時の処理

        render_mywords("やっほー")
    }
    return false;
}