http = require('http')
fs = require('fs').promises

const known = {
  '/': true,
  '/style.css': true,
  '/code.js': true,
  '/favicon.jpg': true,
}

fn = async function(req,res){
  try{

    if(!known[req.url]){
      console.log(`.${req.url}`)
    }

    let header = {}
    const extention = req.url.split('.').pop()
    const type = mimes[extention]
    if(type!=null){
      header = {'Content-Type':type}
    }
    
    if(req.url.startsWith('/api/')) {
      let data = api(req.url)
      res.writeHead(200, {'Content-Type':'application/json'})
      return res.end(JSON.stringify(data))
    }

    let path = (req.url == '/' ? `./www/index.html` : `./www/${req.url}`)

    file = await fs.readFile(path)
    res.writeHead(200, header)
    return res.end(file)
  } catch(e) {

    console.log(e)
  }

}

server = http.createServer(fn).listen(17050)

const mimes = {
  html:'text/html',
  css:'text/css',
  js:'application/javascript',
  json:'application/json',
}

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 17051 })

require('./www/util')
const events = require('./www/events')

function bcast(sender, msg){
  for(user in sockets){
    if(user == sender){ continue }
    sockets[user].send(msg)
  }
  sockets[user].send(msg)
}

wss.on('connection', function connection(ws) {
  let guid = uuidv4()
  ws.guid = guid
  sockets[guid] = ws
  users[guid] = {guid}
  console.log('ws-join: %s', guid)

  ws.on('message', function incoming(data) {
    bcast(guid, data)
    events.receive({data})
    // console.log('ws: %s', data)
  })

  ws.on('close', function closing(message) {
    delete(sockets[guid])
    delete(events.users[guid])
    console.log('ws-left: %s', guid)
    bcast(guid, JSON.stringify({type:'left', guid}))
  })

  ws.send(JSON.stringify({type:'guid', guid}))
  bcast(guid, JSON.stringify({type:'join', guid}))
})

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}


const sockets = {}
function api(path){
  if(path == '/api/game/state'){
    return events.users
  }
  return {}
}













