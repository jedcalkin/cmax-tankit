try{
  if(localStorage['tankit-user'].length > 3){
    location.pathname = '/game'
  }
}catch(e){}

const input = document.querySelector('input')

rnd = (s)=>~~(Math.random()*s)
const id = rnd(2**16).toString(36)
const cc = ()=>(8+rnd(8)).toString(16).toUpperCase()
const colour = `#${cc()}${cc()}${cc()}`

const fn = (e)=>{
  let name = input.value
  if(name.length > 2){
    let o = {
      id,
      name,
      colour
    }
    localStorage['tankit-user'] = JSON.stringify(o)
    location.pathname = '/game'
  }
}

input.onchange = fn
window.onkeydown = (e)=>{if(e.key == 'Enter'){fn(e)}}
