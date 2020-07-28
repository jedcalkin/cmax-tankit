
users = {}
async function eventsInit(){
  users = await fetch('/api/game/state').then((r)=>r.json())
  // users[guid].name = 'self'
}

async function receive(e){
  let event = parseJSON(e.data)
  // log(event)
  try{
    if(users[event.guid] == null){
      users[event.guid] = {guid:event.guid}
    }
    events[event.type](event)
  } catch(e){
    console.error(e)
  }
}

const events = {
  // ws
  guid: (event)=>{
    guid = event.guid
    log(guid)
  },
  test: (event)=>{
    log(event)
  },

  // players
  join: (event)=>{
    log(`player ${event.guid} joined`)
  },
  left: (event)=>{
    log(`player ${event.guid} left`)
    delete(users[event.guid])
  },
  name: (event)=>{
    log(`${event.guid} is ${event.name}`)
    users[event.guid].name = event.name
    log(users[event.guid])
  },
  msg: (event)=>{
    log(event)
  },

  // tank
  pos: (event)=>{
    log(event)
  },
  shot: (event)=>{
    log(event)
  },
  newTank: (event)=>{
    log(`${ event.guid } switched to tankType ${event.index}`)
  },
}

try {
  module.exports = {
    receive,
    users
  }
} catch(e){}
