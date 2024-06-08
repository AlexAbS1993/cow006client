class Block {
    constructor(x, y, config){
      this.height = config.height | 50
      this.width = config.width | 50
      this.position = createVector(x, y)
      this.id = config.id
      this.velocity = createVector(0, 0)
      this.accumulate = createVector(0,0)
      this.angle = 0
      this.movement = null
      this.selectable = config.selectable
      this.selected = false
      this.placer = config.placer
      this.effects = [{}, {}, {}]
      this.timeSpeed = 60
      this.maximumSpeed = 4
      this.movementPoint = null
      this.layerPlacement = null
      this.color = config.style ? config.style.backgroundColor : "rgb(55, 17, 209)"
      this.blocked = false
    }
    update(){
      this.velocity.add(this.accumulate)
      this.velocity.limit(this.maximumSpeed)
      this.position.add(this.velocity)
      this.accumulate.set(0,0)
    }
    applyForce(force){
      this.accumulate.add(force)
    }
    checkEffect(layer){
      for (let effectName in this.effects[layer]){
        switch(effectName){
          case "selected": {
            if (this.isSelected()){
              this.effects[layer]["selected"].execute(this)
            }
            continue
          }
          case "moving": {
            if (this.haveMovementPoint()){
              this.effects[0]['moving'].execute(this)
            }
            continue
          }
          default: {
            
          }
        }
      }
    }
    draw(){
      push()
      this.checkEffect(0)
      pop()
      push()
      noStroke()
      fill(this.color)
      translate(this.position.x, this.position.y)
      rotate(this.angle)
      rect(0, 0, this.width, this.height)
      pop()
      push() 
      this.checkEffect(1)
      pop()
    }
    haveMovementPoint(){
      return Boolean(this.movementPoint)
    }
  move(target = this.movementPoint){
    if (dist(target.x, target.y, this.position.x, this.position.y) <= this.maximumSpeed){
      this.velocity.set(0, 0)
      this.movementPoint = null
      return
    }
    let path = p5.Vector.sub(target, this.position)
    path.setMag(this.maximumSpeed)
    let force = p5.Vector.sub(path, this.velocity)
    this.applyForce(force)
    return
  }
  isItMe(mX,mY){
    let distance = dist(mX, mY, this.position.x, this.position.y)
    return distance < this.width/2
  }
  amIPlacer(){
    return this.placer
  }
  amISelectable(){
    return this.selectable
  }
  addEffect(effect, layer){
    this.effects[layer][effect.name] = effect
  }
  getEffect(name){
    return this.effects[name]
  }
  setSelected(value){
    this.selected = value
  }
  isSelected(){
    return this.selected
  }
  itIsBlocked(){
    return this.blocked
  }
  // Возвращает boolean-значение, оповещающее, что найден элемент, на котором сработало нажатие. Необходимо заранее через обработчик эвентов 
  // передать стратегии по работе с имеющимся выбранным и невыбранным элементом
  mouseClicked(mX, mY, gl, strategies){
    let mouseX = mX
    let mouseY = mY
    let amIClicked = this.isItMe(mouseX, mouseY);
    if (amIClicked){
      if (this.itIsBlocked()){
        return true
      }
      if (gl.getEventController('select').isSelected()){   
        return strategies['selectedStrategy'].execute(this)
       }
       else{
        return strategies['unselectedStrategy'].execute(this)
       }
    }
    else {
      return false
    }
  }
  getCurrentLayer(){
    return this.layerPlacement
  }
  setLayer(layer){
    this.layerPlacement = layer
  }
}