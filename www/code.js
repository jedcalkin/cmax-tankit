
let body = document.querySelector('body')
let guid = 'anonymous'

let user = JSON.parse(localStorage['tankit-user'])
body.style.color = user.colour

var ws = new WebSocket(`ws://${location.hostname}:17051`)
ws.onopen = async ()=>{
  await eventsInit(user)
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


