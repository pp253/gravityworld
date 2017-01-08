class GravityWorld {
  constructor (canvas, state) {
    this.state = {
      pause: true,
      round: 0,
      fps: (state && state.fps) || 60,
      playSpeed: (state && state.playSpeed) || 1,
      gravitationalConstant: (state && state.gravitationalConstant) || 3192053.26975
    }

    this.balls = []
    this.canvas = canvas.canvas
    this.canvasCtx = canvas.ctx

    this.loop = setInterval(this.operate.bind(this), parseInt(1000 / this.state.fps / this.state.playSpeed))
  }

  start () {
    this.state.pause = false
  }

  pause () {
    this.state.pause = true
  }

  newBall (ball) {
    return {
      name: ball.name || 'unname',
      x: ball.x || null,
      y: ball.y || null,
      r: ball.r ||
        (ball.mass && Math.log10(ball.mass) * 10) ||
        Math.log10(ball.x ** 2 + ball.y ** 2) * 5,
      velocity: {
        x: (ball.velocity && ball.velocity.x) || 0,
        y: (ball.velocity && ball.velocity.y) || 0
      },
      mass: ball.mass || 0,
      color: ball.color || 'black'
    }
  }

  addBall (ball) {
    this.balls.push(ball)
  }
  /*
  removeBall (ballIdx) {
    delete this.balls[ballIdx]
  }
  */

  render () {
    // clear
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.balls.forEach(ball => {
      this.canvasCtx.beginPath()
      this.canvasCtx.arc(
        ball.x,
        ball.y,
        ball.r || Math.log10(ball.mass) * 10,
        0,
        2 * Math.PI
      )
      this.canvasCtx.stroke()
      this.canvasCtx.fillStyle = ball.color
      this.canvasCtx.fill()
      this.canvasCtx.closePath()
    })
  }

  resize (width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }

  operate () {
    if (this.state.pause) {
      return
    }

    // run
    let tmpVelocity = {}

    this.balls.forEach((ball, ballIdx) => {
      this.balls.forEach((otherBall, otherBallIdx) => {
        if (ballIdx === otherBallIdx) {
          return
        }

        let deltaX = otherBall.x - ball.x
        let deltaY = otherBall.y - ball.y
        let r_2 = deltaX ** 2 + deltaY ** 2

        // deal with collision
        if (r_2 <= (ball.r + otherBall.r) ** 2) {
          tmpVelocity[ballIdx] = {
            x: ((ball.mass - otherBall.mass) * ball.velocity.x + 2 * otherBall.mass * otherBall.velocity.x) / (ball.mass + otherBall.mass),
            y: ((ball.mass - otherBall.mass) * ball.velocity.y + 2 * otherBall.mass * otherBall.velocity.y) / (ball.mass + otherBall.mass)
          }
        } else {
          let r_2_5 = r_2 ** 2.5
          let GM_r2_5 = this.state.gravitationalConstant * otherBall.mass / r_2_5 * (1 / this.state.fps)

          ball.velocity.x += GM_r2_5 * deltaX
          ball.velocity.y += GM_r2_5 * deltaY
        }
      })
    })

    Object.keys(tmpVelocity).forEach(ballIdx => {
      this.balls[ballIdx].velocity.x = tmpVelocity[ballIdx].x
      this.balls[ballIdx].velocity.y = tmpVelocity[ballIdx].y
    })

    // apply velocity to every ball
    this.balls.forEach(ball => {
      ball.x += ball.velocity.x
      ball.y += ball.velocity.y
    })

    this.render()

    this.state.round += 1
  }
}

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
