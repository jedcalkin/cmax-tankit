
let tank_old = 1 << 30
let tank = 1 << 30

// 1000000000000000000000000000000
// 1_______________SsDTT0000tt0000
// 1_______________1111111111111111
// 0111111111111111111111111111111 // (2**30)-1
// S[1] = gun firing
// s[1] = speed of tank
// D[1] = direction of tank movment
// T[2] = Tank turning direction/speed
// t[2] = turret angle direction/speed

// window.onkeypress = (e)=>{ log(`P ${e.keyCode} ${e.key}`) }
window.onkeyup = (e)=>{ let fn = pressEvents[e.keyCode]
  if(fn){ fn(0) } }
window.onkeydown = (e)=>{ let fn = pressEvents[e.keyCode]
  if(fn){ fn(1) } }

const yes = (2**31)-1 // 1111111111111111111111111111111

pressEvents = {
  32: (d)=>{ // space
    if(d){
      tank = tank | 16384 // 1<<14
    } else {
      tank = tank & (yes ^ 16384) // ~(1<<14)
    }
  },
  87: (d)=>{ // w
    if(d){
      tank = tank | 12288 // (1<<13)+(1<<12)
    } else {
      tank = tank & (yes ^ 12288)
    }
  },
  83: (d)=>{ // s
    if(d){
      tank = tank | 4096 // 1<<12
    } else {
      tank = tank & (yes ^ 4096)
    }
  },
  65: (d)=>{ // a
    if(d){
      tank = tank | 3072 // (1<<11)+(1<<10)
    } else {
      tank = tank & (yes ^ 3072)
    }
  },
  68: (d)=>{ // d
    if(d){
      tank = tank | 2048 // 1<<11
    } else {
      tank = tank & (yes ^ 2048)
    }
  },
  37: (d)=>{ // left
    if(d){
      tank = tank | 48 // (1<<5)+(1<<4)
    } else {
      tank = tank & (yes ^ 48)
    }
  },
  39: (d)=>{ // right
    if(d){
      tank = tank | 32 // 1<<5
    } else {
      tank = tank & (yes ^ 32)
    }
  },
  0: (d)=>{ // 
    if(d){
      tank = tank | 16384 // 1<<14
    } else {
      tank = tank & (yes ^ 16384) // ~(1<<14)
    }
  },
}

const p = document.querySelector('p')

let v = ((2**16)-1)
let b = (s)=>s.toString(2)
let en = (s)=>s.toString(36)
let i = 0
setInterval(()=>{
  i++
  if(tank == tank_old && i%200!=0){ return }
  tank_old = tank
  ws.send((tank & v).toString(36))

  let usrs = []
  for (u in state.users){
   usrs.push(JSON.stringify(state.users[u]))
  }

  p.innerHTML = `
    w,a,s,d,sapce and left,right arrows
    <br>
    <br>
    input encoding
    <br>
    ${tank}
    <br>
    ${b(tank)}
    <br>
    ${tank & v}
    <br>
    ${b(tank & v)}
    <br>
    ${(tank & v).toString(36)}
    <br>
    <hr>
    <br>
    ${usrs.join('\n<br>')}
`

},10)

