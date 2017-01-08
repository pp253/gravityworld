// inspired by sebuda

function run () {
  let app = document.getElementById('app')
  let canvas = document.getElementById('main')
  let ctx = canvas.getContext('2d')
  let worldState = {
      fps: 60,
      playSpeed: 1,
      gravitationalConstant: 3192053.26975,
      margin: {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
      }
  }
  let myWorld = new GravityWorld({canvas: canvas, ctx: ctx}, worldState)

  myWorld.resize(app.clientWidth, app.clientHeight)
  app.onresize = function () {
    myWorld.resize(app.clientWidth, app.clientHeight)
  }

  let loop = () => {
    let offset = 0
    let speed = 3
    let ballBoy = myWorld.newBall({
      x: 0,
      y: app.clientHeight / 2 - offset,
      velocity: {
        x: speed,
        y: 0
      },
      mass: 3000,
      color: 'blue'
    })
    let ballGirl = myWorld.newBall({
      x: app.clientWidth,
      y: app.clientHeight / 2 + offset,
      velocity: {
        x: -speed,
        y: 0
      },
      mass: 3000,
      color: 'red'
    })
    myWorld.addBall(ballBoy)
    myWorld.addBall(ballGirl)
  }

  loop()
  setInterval(loop, 2000)

  myWorld.start()
}

window.onload = run
