
let body_tag = document.querySelector('body')
let users_tag = document.querySelector('users')
let guid = 'anonymous'

let user = JSON.parse(localStorage['tankit-user'])
body_tag.style.color = user.colour

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

const display = {
  users: (users)=>{
    let tags = users_tag.children
    let userList = [];
    for(let u in users){
      userList.push(users[u].name)
    }
    userList.sort()
    if(tags.length>userList.length){
      // TODO add
    }

    // TODO real html
    users_tag.innerHTML = userList.join('<br>\n')
  },

}


