class GravityWorld {
  constructor (canvas, state) {
    this.state = {
      pause: true,
      round: 0,
      fps: (state && state.fps) || 60,
      playSpeed: (state && state.playSpeed) || 1,
      gravitationalConstant: (state && state.gravitationalConstant) || 3192053.26975,
      render: (state && state.render) || true,
      margin: {
        top: 2000,
        right: 2000,
        bottom: 2000,
        left: 2000
      },
      garbageCollection: true
    }

    this.balls = []
    this.canvas = canvas.canvas
    this.canvasCtx = canvas.ctx || canvas.canvas.getContext('2d')
  }

  start () {
    this.loop = setInterval(this.operate.bind(this), parseInt(1000 / this.state.fps / this.state.playSpeed))
    this.state.pause = false
  }

  pause () {
    this.state.pause = true
  }

  newBall (ball) {
    if (!ball) {
      return null
    }

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
    console.log(this.balls.length)
    this.balls.push(ball)
  }

  removeBall (ballIdx) {
    console.log(this.state.balls)
    if (!this.balls[ballIdx]) {
      return
    }
    delete this.balls[ballIdx]
  }

  render () {
    /*
    // @pp253 this cannot work, and i don't know why

    this.balls.forEach(ball => {
      let rDividedBy2 = ball.r / 2
      this.canvasCtx.clearRect(ball.x - rDividedBy2 - 2, ball.y - rDividedBy2 - 2, ball.x + rDividedBy2 + 2, ball.y + rDividedBy2 + 2)
      console.log(ball.x - rDividedBy2, ball.y - rDividedBy2, ball.x + rDividedBy2, ball.y + rDividedBy2)
    })
    */
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.balls.forEach(ball => {
      if (!ball ||
        ball.x + ball.r < 0 || ball.x - ball.r > this.canvas.width ||
        ball.y + ball.r < 0 || ball.y - ball.r > this.canvas.height) {
        return
      }
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

    let tmpVelocity = {}

    this.balls.forEach((ball, ballIdx) => {
      this.balls.forEach((otherBall, otherBallIdx) => {
        if (!ball || !otherBall || ballIdx === otherBallIdx) {
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

    // apply velocity to each ball
    this.balls.forEach((ball, ballIdx) => {
      if (!ball) {
        return
      }

      ball.x += ball.velocity.x
      ball.y += ball.velocity.y

      // garbage collection
      if (this.state.garbageCollection &&
        (ball.x + ball.r < -this.state.margin.left || ball.x - ball.r > this.canvas.width + this.state.margin.right ||
        ball.y + ball.r < -this.state.margin.top || ball.y - ball.r > this.canvas.height + this.state.margin.bottom)) {
        this.removeBall(ballIdx)
        return
      }
    })

    if (this.state.render) {
      this.render()
    }

    this.state.round += 1
  }
}
