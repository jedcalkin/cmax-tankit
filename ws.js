function suid() {
  return 'xxxx-xxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

require('./www/util')
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 17051 })
const sockets = {}
let state = undefined
module.exports = (st)=>{
  state=st
  state.users = {}
}
wss.on('connection', connection)

function bcast(msg, sender){
  for(user in sockets){
    if(user == sender){ continue }
    sockets[user].send(msg)
  }
}

function connection(ws) {
  let uid = suid()
  ws.uid = uid
  sockets[uid] = ws

  ws.on('message', (event)=>rec(event, ws))
  ws.on('close', ()=>{
    delete(sockets[uid])
    closing(uid)
  })

  join(uid, ws)
  //ws.send('u'+uid)
}
function join(uid, ws) {
  state.users[uid] = {}
  bcast('j'+JSON.stringify({type:'state', users:state.users}))
}

function closing(uid) {
  delete(state.users[uid])
  bcast('j'+JSON.stringify({type:'state', users:state.users}))
}

tank = {event:()=>{}} // noop TODO

function rec(event, ws) {
  if(event.length<4){ return tank.event() }
  try {
    event = JSON.parse(event)
    jsonEvent(event, ws)
  } catch(e) {
    // not a json event
    log(e)
    log(event)
  }
}


function jsonEvent(event, ws){
  if(event.type == 'user'){
    ws.id = event.user.id
    delete(event.user.id)
    event.user.uid = ws.uid
    state.users[ws.uid] = event.user
    bcast('j'+JSON.stringify({type:'state', users:state.users}))
  }
}
