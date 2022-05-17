
const roomutils = require('./roomutils')

a = new roomutils.player("socket-a", "a-than")
r = new roomutils.room("room1")
console.log(r.players)
pls = r.players.push(a)
console.log(r.players)
console.log(pls)