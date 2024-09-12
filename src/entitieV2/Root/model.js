import { MoveManager } from "../../managers/moveManager.ts"

export class Root {
    constructor(){
        this.layers = [[],[],[]]
        this.htmlEls = []
        this.events = {}
        this.moves = []
        this.moveManager = new MoveManager()
    }
    setHTMLElement(HTMLel){
        this.htmlEls.push(HTMLel)
    }
    clearHTMLElements(){
        this.htmlEls.forEach(el => {
            el.elt.parentNode.removeChild(el.elt)
        })
        this.htmlEls = []
        return
    }
    deleteHTMLElement(id){
        this.htmlEls.forEach(el => {
            el.elt.parentNode.removeChild(el.elt)
        })
        // this.htmlEls = this.htmlEls.filter(el => el.)
        return
    }
    getLayer(layer = 1){
        return this.layers[layer]
    }
    addElement(element, layer = 1){
        if (!this.layers[layer]){
            this.layers[layer] =  []
        }
        this.layers[layer].push(element)
        element.setCurrentLayer(layer)
        return this
    }
    update(){
        for (let layer of this.layers){
            for(let element of layer){
                element.update()
            }
        }
    }
    draw(){
        for (let layer of this.layers){
            for(let element of layer){
                element.draw()
            }
        }
    }
    move(){
        this.moveManager.move()
    }
    addEventController(eventController){
        this.events[eventController.eventName] = eventController
        return this
    }
    deleteEventController(name){
        delete this.events[name]
        return this
    }
    clearEventControllers(){
        this.events = {}
        return
    }
    getEventController(name){
        return this.events[name]
    }
    deleteElement(id, layer = 1){
        this.layers[layer] = this.layers[layer].filter(el => el.id !== id)
    }
    getElementByUniqueId(uniqueId, layer = 1){
       return this.layers[layer].find(element => element.id === uniqueId)
    }
}