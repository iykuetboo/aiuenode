socket.on('game-start', (data) => {
    console.log(`game-start!! ${data}`);
    p_i = data.players.findIndex(p => p._socket_id == socket.id)+1
    $("#my-word button").css({
        'border-color': `var(--color-player-${p_i})`,
        'color': `var(--color-player-${p_i})`
    })
    update_view("ongame")
})

socket.on('set-word-start', () => {
    console.log("set-word-start");
    state = "set-word"
    set_gamestatus_message(`
    <span>
      自分のワードを決めてください
    </span>`)
    $(".aiue-line > .aiue-button").addClass("interact")
    $("#attack-button").addClass("interact")
})

socket.on('set-word-ok', () => {
    console.log("set-word-ok");
    state = "wait"
    $(".aiue-line > .aiue-button").removeClass("interact")
    $("#attack-button").removeClass("interact")
})

socket.on('start-main-loop', () => {
    console.log("start-main-loop")
})

socket.on('turn-change', (data) => {
    set_gamestatus_message(`
    <span>
      <span class="player${data.index}">${data.name}</span>の番です
    </span>`)
    if(data.index==p_i){
        console.log("it's my turn")
        state = "attack"
        $(".aiue-line > .aiue-button").addClass("interact")
        $("#attack-button").addClass("interact")
    }else{
        state = "wait"
        $(".aiue-line > .aiue-button").removeClass("interact")
        $("#attack-button").removeClass("interact")
    }
})