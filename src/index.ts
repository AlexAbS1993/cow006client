import p5 from 'p5'
import { Game } from './entitieV2/Game/model'
import { EventsEnum } from './entitieV2/Game/Events/events.type'
import { UserInfo } from './entitieV2/Game/User/model'

const p5c:HTMLElement = document.getElementById('p5c') as HTMLElement
const documentElement = document.documentElement
let time = 0
function sketch(p5: p5){
    let h = documentElement.clientHeight - 5
    let w = documentElement.clientWidth -5
    let game:any = new Game(p5, {width: w, height: h}, new UserInfo())
    let backgroundImage:p5.Image
    p5.preload = function(){
      backgroundImage = p5.loadImage('./source/dist/img/back2.jpg')
    }
    p5.setup = function() {
        let cnvs = document.getElementById('canvas') as HTMLCanvasElement
        p5.createCanvas(w, h, "p2d", cnvs);
        p5.rectMode(p5.CENTER)
        p5.angleMode(p5.DEGREES)
        game.connect()
      };   
      p5.draw = function() {
        time++ 
        if (time > 1000000){
          time = 0
        }
        if (time % 60){
          game.timeOutManager.go()
        }
        switch(game.state){
          case "doubleApp": {
            game.root.draw()
            break
          }
          case "menu": {
            game.root.draw()
            game.root.update()
            break
          }
          case "room": {
            game.root.draw()
            game.root.update()
            break
          }
          case "game":{
            game.root.move()
            game.root.draw()
            game.root.update()
            break   
          }
          default: {
            
            break
          }
        }
      };
      p5.mouseClicked = function(){
        if (game.root.getEventController(EventsEnum.mouseClicked)){
          game.root.getEventController(EventsEnum.mouseClicked).check(p5.mouseX, p5.mouseY, game.root)
        }
      }
      p5.mouseMoved = function(){
        if (game.root.getEventController(EventsEnum.mouseMoved)){
          game.root.getEventController(EventsEnum.mouseMoved).check(p5.mouseX, p5.mouseY, game.root)
        }
      }
}

new p5(sketch, p5c);