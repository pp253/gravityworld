
function run () {
  let app = document.getElementById('app')
  let canvas = document.getElementById('main')
  let ctx = canvas.getContext('2d')
  let worldState = {
      fps: 60,
      playSpeed: 1,
      gravitationalConstant: 3192053.26975
  }
  let myWorld = new GravityWorld({canvas: canvas, ctx: ctx}, worldState)

  myWorld.resize(app.clientWidth, app.clientHeight)
  app.onresize = function () {
    myWorld.resize(app.clientWidth, app.clientHeight)
  }

  let ballSun = myWorld.newBall({
    name: 'sun',
    x: 800,
    y: 500,
    velocity: {
      x: 0,
      y: 0
    },
    mass: 30000,
    color: 'red'
  })
  let ballEarth = myWorld.newBall({
    name: 'earth',
    x: 800,
    y: 300,
    velocity: {
      x: 14.384233150225,
      y: 0
    },
    mass: 100,
    color: 'green'
  })

  myWorld.addBall(ballSun)
  myWorld.addBall(ballEarth)

  myWorld.start()
}

window.onload = run
