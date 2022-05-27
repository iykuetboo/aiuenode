
update_view("roomselect")
let selected = null
let state = "set-word"
let myword = ""
let p_i = 0;

function update_view(state) {
    $('.switch-view').each(function (index, element) {
        if ($(element).hasClass(state)) {
            $(element).removeClass("hide");
        }
        else {
            $(element).addClass("hide");
        }
    })
}

$(".aiue-line > .aiue-button").click(function () {

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
            console.log($(this));
            selected = $(this)[0];
            $(this)[0].classList.add("selected");
            console.log(`aiue-button ${selected.name} clicked`);
            break
    }

})

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

render_mywords("おはよう！")

document.addEventListener('keypress', keypress_ivent);

function keypress_ivent(e) {
    if (e.code === 'KeyA') {
        //Aキーが押された時の処理

        render_mywords("やっほー")
    }
    return false;
}