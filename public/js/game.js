
update_view("roomselect")
let selected = null

function update_view(state) {
    $('.switch-view').each(function (index, element) {
        console.log(element)
        if ($(element).hasClass(state)) {
            $(element).removeClass("hide");
        }
        else {
            $(element).addClass("hide");
        }
    })
}


$(".aiue-line > .aiue-button").click(function () {
    if (selected) {
        selected.classList.remove("selected");
    }
    console.log($(this));
    selected = $(this)[0];
    $(this)[0].classList.add("selected");
    console.log(`aiue-button ${selected.name} clicked`);
})

$("#attack-button").on("click", () => {
    if (selected) {
        console.log(`attack-button clicked: selected = ${selected.name}`);
        socket.emit("game", { action: `attack on ${selected.name}`, value: selected.name })
        selected.classList.remove("selected");
        selected = null;
    }
})

$("#ready-button").on("click", () => {
    $(this).toggleClass("is-ready")
    console.log(`ready-button clicked`);
    socket.emit("ready", {})
})
