// inspired by sebuda

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

  let ballsArrayProps = {
    gravityWorld: myWorld,
    center: {
      x: app.clientWidth / 2,
      y: app.clientHeight / 2
    },
    offset: 200,
    distance: 800,
    initialSpeed: 18.9,
    number: 6,
    mass: 100,
    color: 'green'
  }

  let ballSun = myWorld.newBall({
    name: 'sun',
    x: ballsArrayProps.center.x,
    y: ballsArrayProps.center.y,
    velocity: {
      x: 0,
      y: 0
    },
    mass: 30000,
    color: 'red'
  })
  myWorld.addBall(ballSun)

  setInterval((props) => {
    props = ballsArrayProps
    if (!props || !props.gravityWorld) {
      return
    }

    props.number = props.number || 4
    props.distance = props.distance || 800
    props.initialSpeed = props.initialSpeed || 100
    props.center = props.center || {x: 100, y: 100}
    props.offset = props.offset || 100
    props.mass = props.mass || 100
    props.color = props.color || 'green'

    for (let i = 0; i < props.number; i++) {
      let degree = 2 * Math.PI / props.number * i
      let ball = props.gravityWorld.newBall({
        x: props.center.x + props.distance * Math.cos(degree) - props.offset * Math.sin(degree),
        y: props.center.y - props.distance * Math.sin(degree) - props.offset * Math.cos(degree),
        velocity: {
          x: -props.initialSpeed * Math.cos(degree),
          y: props.initialSpeed * Math.sin(degree)
        },
        mass: props.mass || 100,
        color: props.color || 'green'
      })
      props.gravityWorld.addBall(ball)
    }
  }, 1700)

  myWorld.start()
}

window.onload = run
