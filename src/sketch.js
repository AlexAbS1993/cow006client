let movement;
let time = 1*60;
let selectController;
let root;
let mouseClickController;
let field;
let rowsArea;
let playersHandArea;
let enemiesHandArea;
let poolArea;

let canvasWidth = 1280
let canvasHeigth = 800

function setup() {
  createCanvas(canvasWidth, canvasHeigth);
  rectMode(CENTER)
  angleMode(DEGREES)
  root = new Root()
  selectController = new Select()
  mouseClickController = new EventController('mouseClicked')
  field = new Block(width/2, height/2, {id: 0, selectable: false, placer: false, width: width, height: height, 
  style: {backgroundColor: "rgb(229, 202, 208)"}})
  rowsArea = new Block()
  root.addElement(field, 0)
  root.addEventController(mouseClickController)
  root.addEventController(selectController)
  mouseClickController.addListener(field)
  let unselectedStrategyForMouseClick = new unselectedStrategy(selectController)
  let selectedStrategyForMouseClick = new selectedStrategy(selectController)
  mouseClickController.addStrategy(unselectedStrategyForMouseClick, unselectedStrategyForMouseClick.getName())
  mouseClickController.addStrategy(selectedStrategyForMouseClick, selectedStrategyForMouseClick.getName())
  let effect = new SelectEffect("selected")
  let movingEffect = new MovingEffect("moving")
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