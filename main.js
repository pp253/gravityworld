class GravityWorld {
  start () {
    this.state.pause = false
  }

  pause () {
    this.state.pause = true
  }

  newBall (ball) {
    return {
      id: this.state.nextBallId++,
      name: ball.name || 'unname',
      x: ball.x || null,
      y: ball.y || null,
      r: ball.r ||
        (ball.mass && Math.log10(ball.mass) * 10) ||
        Math.log10(Math.pow(ball.x, 2) + Math.pow(ball.y, 2)) * 5,
      velocity: {
        x: (ball.velocity && ball.velocity.x) || 0,
        y: (ball.velocity && ball.velocity.y) || 0
      },
      mass: ball.mass || 0,
      color: ball.color || 'black'
    }
  }

  addBall (ball) {
    this.state.balls.push(ball)
  }
  /*
  removeBall (ballId) {
    delete this.state.balls[ballId]
  }
  */

  operate () {
    if (this.state.pause) {
      return
    }

    // run
    let tmpVelocity = {}

    this.state.balls.forEach((ball, ballId) => {
      this.state.balls.forEach((otherBall, otherBallId) => {
        if (ballId === otherBallId) {
          return
        }

        let deltaX = otherBall.x - ball.x
        let deltaY = otherBall.y - ball.y
        let r_2 = Math.pow(deltaX, 2) + Math.pow(deltaY, 2)

        // deal with collision
        if (r_2 <= Math.pow(ball.r + otherBall.r, 2)) {
          tmpVelocity[ball.id] = {
            x: ((ball.mass - otherBall.mass) * ball.velocity.x + 2 * otherBall.mass * otherBall.velocity.x) / (ball.mass + otherBall.mass),
            y: ((ball.mass - otherBall.mass) * ball.velocity.y + 2 * otherBall.mass * otherBall.velocity.y) / (ball.mass + otherBall.mass)
          }
        } else {
          r_2 = Math.pow(r_2, 2.5)
          let GM_r2_5 = this.state.gravitationalConstant *
                otherBall.mass / r_2 * (1 / this.state.fps)

          ball.velocity.x += GM_r2_5 * deltaX
          ball.velocity.y += GM_r2_5 * deltaY
        }
      })
    })

    Object.keys(tmpVelocity).forEach((ballId) => {
      this.state.balls[ballId].velocity.x = tmpVelocity[ballId].x
      this.state.balls[ballId].velocity.y = tmpVelocity[ballId].y
    })

    // apply velocity to every ball
    this.state.balls.forEach((ball, ballId) => {
      ball.x += ball.velocity.x
      ball.y += ball.velocity.y
    })

    this.render()

    this.state.round++
  }

  render () {
    // clear
    this.mainCanvasCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)

    this.state.balls.forEach((ball, ballId) => {
      this.mainCanvasCtx.beginPath()
      this.mainCanvasCtx.arc(
        ball.x,
        ball.y,
        ball.r || Math.log10(ball.mass) * 10,
        0,
        2 * Math.PI
      )
      this.mainCanvasCtx.stroke()
      this.mainCanvasCtx.fillStyle = ball.color
      this.mainCanvasCtx.fill()
      this.mainCanvasCtx.closePath()
    })
  }

  simulator () {
    let done = false
    while (!done) {
      console.log('before:', this.state.balls[1].velocity.x)
      let simulateDone = false
      let lastState = {
        r_2: Math.pow(this.state.balls[0].y - this.state.balls[1].y, 2),
        initVX: this.state.balls[1].velocity.x,
        round: 0
      }
      while (!simulateDone) {
        for (let i = 0; i < 5000; i++) {
          this.operate()
        }

        if ((Math.pow(this.state.balls[1].x - this.state.balls[0].x, 2) + Math.pow(this.state.balls[1].y - this.state.balls[0].y, 2)) > lastState.r_2) {
          //this.state.balls[1].velocity.x -= 0.1 / (Math.pow(++lastState.round, 1.5))
          this.state.balls[1].velocity.x = lastState.initVX - 0.0000000001
          lastState.initVX -= 0.0001
        } else {
          this.state.balls[1].velocity.x = lastState.initVX + 0.0000000001
          lastState.initVX += 0.0001
        }

        this.state.balls[1].x = 800
        this.state.balls[1].y = 300
        this.state.balls[1].velocity.y = 0
        this.state.balls[0].x = 800
        this.state.balls[0].y = 500
        this.state.balls[0].velocity.x = 0
        this.state.balls[0].velocity.y = 0

        if (++lastState.round % 10000 === 0) {
          console.log(lastState.round, this.state.balls[1].velocity.x)
        }
      }
    }
  }

  resize (width, height) {
    this.mainCanvas.width = width
    this.mainCanvas.height = height
  }

  constructor () {
    this.state = {
      pause: true,
      fps: 60,
      canvasId: 'main',
      nextBallId: 0,
      round: 0,
      balls: [],
      gravitationalConstant: 3192053.26975,
      playSpeed: 1
    }

    this.mainCanvas = document.getElementById(this.state.canvasId)
    this.mainCanvasCtx = this.mainCanvas.getContext('2d')


    this.loop = setInterval(this.operate.bind(this), parseInt(1000 / this.state.fps / this.state.playSpeed))
  }
}

let app = $('#app')
let myWorld = new GravityWorld()

myWorld.resize(app.width(), app.height())
app.resize(function () {
  myWorld.resize(this.width(), this.height())
})

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

/*
for (let i = 0; i < 5; i++) {
  myWorld.addBall(myWorld.newBall({
    x: 500 + 100 * i,
    y: 300 + 100 * i,
    mass: Math.log10(100 * (i + 1)) * 10
  }))
}
*/

myWorld.start()
//myWorld.simulator()
