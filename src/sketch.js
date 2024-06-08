let block, place, place2, block2;
let movement;
let time = 1*60;
let selectController;
let effect;
let root;
let mouseClickController;
let field;

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER)
  angleMode(DEGREES)
  root = new Root()
  selectController = new Select()
  mouseClickController = new EventController('mouseClicked')
  block = new Block(width/2, 380,{id: Math.random()*1000000000, selectable: true, placer: false, selectController});
  block2 = new Block(width/2, 380,{id: Math.random()*1000000000, selectable: true, placer: false, selectController});
  place = new Block(width/2 + 50, 100,{id: Math.random()*1000000000, selectable: false, placer: true, selectController});
  place2 = new Block(width/2 - 150, 100,{id: Math.random()*1000000000, selectable: false, placer: true, selectController});
  field = new Block(width/2, height/2, {id: 0, selectable: false, placer: false, selectController, width: width, height: height, 
  style: {backgroundColor: "rgb(229, 202, 208)"}})
  root.addElement(place)
  root.addElement(place2)
  root.addElement(block)  
  root.addElement(field, 0)
  root.addEventController(mouseClickController)
  root.addEventController(selectController)
  mouseClickController.addListener(block)
  mouseClickController.addListener(place)
  mouseClickController.addListener(place2)
  mouseClickController.addListener(field)
  let unselectedStrategyForMouseClick = new unselectedStrategy(selectController)
  let selectedStrategyForMouseClick = new selectedStrategy(selectController)
  mouseClickController.addStrategy(unselectedStrategyForMouseClick, unselectedStrategyForMouseClick.getName())
  mouseClickController.addStrategy(selectedStrategyForMouseClick, selectedStrategyForMouseClick.getName())
  effect = new SelectEffect("selected")
  let me = new MovingEffect("moving")
  block.addEffect(me, 0)
  block.addEffect(effect, 1)
}

function draw() {
  background(220);
  root.move()
  root.draw()
  root.update()
}

function mouseClicked(){
    root.getEventController('mouseClicked').check(mouseX, mouseY, root)
}