
update_view("title")
let selected = null

function update_view(state){
    if(state=="title"){
        $(".only-title").removeClass("hide");
        $(".only-ongame").addClass("hide");
    }
    if(state=="ongame"){
        $(".only-title").addClass("hide");
        $(".only-ongame").removeClass("hide");
    }
}

$(".aiue-line > .aiue-button").click(function(){
    if(selected){
        selected.classList.remove("selected");
    }
    console.log($(this));
    selected = $(this)[0];
    $(this)[0].classList.add("selected");
    console.log(`aiue-button ${selected.name} clicked`);
})

$(".game-control-button").on("click",()=>{
    if(selected){
        console.log(`game-control-button clicked: selected = ${selected.name}`);
        socket.emit("game",{action:`attack on ${selected.name}` , value:selected.name})
        selected.classList.remove("selected");
        selected = null;
    }
})