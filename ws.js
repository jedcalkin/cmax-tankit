function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
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
  let guid = uuidv4()
  ws.guid = guid
  sockets[guid] = ws

  ws.on('message', (event)=>rec(event, ws))
  ws.on('close', ()=>{
    delete(sockets[guid])
    closing(guid)
  })

  ws.send('u'+guid)
  join(guid, ws)
}
function join(guid, ws) {
  state.users[guid] = {guid}
  bcast('j'+JSON.stringify({type:'state', users:state.users}))
}

function closing(guid) {
  delete(state.users[guid])
  bcast('j'+JSON.stringify({type:'state', users:state.users}))
}

function rec(event, ws) {
  log(event)
}

