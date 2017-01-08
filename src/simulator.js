
class Simulator extends GravityWorld {
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

  constructor (props) {
    super(props)
  }
}
