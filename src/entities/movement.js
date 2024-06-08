class Movement{
    constructor(x, y, stepX, stepY){
        this.x = x
        this.y = y
        this.stepX = stepX
        this.stepY = stepY
        this.isDone = false
      this.isPause = false
    }
    setDone(){
      this.isDone = true
    }
    execute(element){
      if(this.isPause){
        return
      }
      if (dist(this.x, this.y, element.x, element.y) <=0.1){
        this.setDone()
      }
      else {
        element.x += this.stepX
        element.y += this.stepY
      }
    }
    setPause(time){
        this.isPause = true
      setTimeout(() => {
        this.isPause = false
      }, time*1000)
    }
  }