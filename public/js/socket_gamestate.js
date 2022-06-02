socket.on('game-start', (data) => {
    console.log(`game-start!! ${data}`);
    p_i = data.players.findIndex(p => p._socket_id == socket.id)+1
    $("#my-word button").css({
        'border-color': `var(--color-player-${p_i})`,
        'color': `var(--color-player-${p_i})`
    })
    update_view("ongame")
})

socket.on('game-info',(data)=>{
    console.log("game-info")
    set_players_info(data.players, data.public_words)
    set_board(data.board)
})

socket.on('set-word-start', () => {
    console.log("set-word-start");
    myword = ""
    state = "set-word"
    update_view("ongame")
    set_gamestatus_message(`
    <span>
      自分のワードを決めてください
    </span>`)
    set_interaction($(".aiue-line > .aiue-button"),true)
    set_interaction($("#attack-button"),true)
})

socket.on('set-word-ok', () => {
    console.log("set-word-ok");
    state = "wait"
    set_interaction($(".aiue-line > .aiue-button"),false)
    set_interaction($("#attack-button"),false)
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
        set_interaction($(".aiue-line > .aiue-button"),true)
        set_interaction($("#attack-button"),true)
    }else{
        state = "wait"
        set_interaction($(".aiue-line > .aiue-button"),false)
        set_interaction($("#attack-button"),false)
    }
})

socket.on('game-finish',(data)=>{
    let val = ""
    data.forEach(v => {
        console.log(`${v.rank}位は${v.player._name}さん（player${v.p_i}）`)
        val = val + `
        <tr>
          <td class="ranking-number">${v.rank}.</td>
          <td class="ranking-name player${v.p_i}">${v.player._name}</td>
        </tr>`
    });

    $('#ranking-table').html(val)
    update_view("result")
})