
let guid = 'anonymous'
var ws = new WebSocket('ws://jedc.nz:17051')

ws.onopen = async ()=>{
  log('open:ws')
  await eventsInit()
}
ws.onerror = console.error
ws.onmessage = receive
function send(type, event){
  ws.send(JSON.stringify({
    type:type,
    guid,
    ...event
  }))
}
