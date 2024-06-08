class Effect{
    constructor(name){
  this.name = name
}
    execute(element){          
    }
  }

class SelectEffect extends Effect {
    constructor(name){
        super(name)
    }
    execute(element){
        push()
        strokeWeight(5)
        stroke(199, 26, 26)
        let widthSide = element.width/2
        let heigthSide = element.height/2
        translate(element.position.x - widthSide, element.position.y - heigthSide)
        line(0,0, 0, element.height)
        line(0,element.height, element.width, element.height)
        line( element.width, element.height, element.width, 0)
        line(element.width,0, 0, 0)
        pop()
    }
}

class MovingEffect extends Effect {
  constructor(name){
    super(name)
}
  execute(element){
    push()
    noStroke()
    translate(element.position.x, element.position.y)
    fill("rgba(242, 171, 29, 0.79)")
    rect(-(element.velocity.x*6), -(element.velocity.y*4), 55, 55)
    pop()
  }
}