http = require('http')
fs = require('fs').promises

const mimes = {
  html:'text/html',
  css:'text/css',
  js:'application/javascript',
  json:'application/json',
}

fn = async function(req,res){
  try{

    if(!known[req.url]){
      //console.log(`.${req.url}`)
    }

    let header = {}
    const extention = req.url.split('.').pop()
    const type = mimes[extention]
    if(type!=null){
      header = {'Content-Type':type}
    }
    
    if(req.url.startsWith('/api/')) {
      let data = api(req.url)
      res.writeHead(data?200:404, {'Content-Type':'application/json'})
      return res.end(JSON.stringify(data))
    }

    let path = (req.url == '/' ? `./www/index.html` : `./www/${req.url}`)

    file = await fs.readFile(path)
    res.writeHead(200, header)
    return res.end(file)
  } catch(e) {
    console.log(e)
    res.writeHead(500, {})
    return res.end('Error')
  }

}

const known = {
  '/': true,
  '/style.css': true,
  '/code.js': true,
  '/favicon.jpg': true,
}

server = http.createServer(fn).listen(17050)
let state = undefined
module.exports = (st)=>state=st
function api(path){
  let query = path.split('?')
  try {
    return endpoints[query[0]](query[1])
  } catch (e) {
    console.log(e)
    throw 500
  }
  return null
}

const endpoints = {
  '/api/users':(q)=>{
    return state.users
  },
}
