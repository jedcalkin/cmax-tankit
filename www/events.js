
const state = {users:{}}
async function eventsInit(){
  state.users = await fetch('/api/users').then((r)=>r.json())
}

async function receive(e){
  let type = e.data.slice(0,1)
  let event = e.data.slice(1)
  try {
    events[type](event)
  } catch(e){
    log([e.data])
    console.error(e)
  }
}

const events = {
  'u': (event)=>guid=event, // set guid
  'j': (event)=>{ // json
    event = parseJSON(event)
    jsonEvents[event.type](event)
  },
}
const jsonEvents = {
  state:(event)=>{
    delete(event.type)
    for(let c in event){
      state[c] = event[c]
    }
  },
}

const events_ = {
  name: (event)=>{
    log(`${event.guid} is ${event.name}`)
    users[event.guid].name = event.name
    log(users[event.guid])
  },
}
