
let guid = 'anonymous'
var ws = new WebSocket(`ws://${location.hostname}:17051`)

ws.onopen = async ()=>{
  await eventsInit()
}
ws.onerror = console.error
ws.onmessage = receive

function send(type, event){
  ws.send('j'+JSON.stringify({
    type:type,
    guid,
    ...event
  }))
}
