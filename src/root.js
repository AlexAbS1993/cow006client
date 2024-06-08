class Root {
    constructor(){
        this.layers = []
        this.events = {}
        this.moves = []
    }
    addElement(element, layer = 1){
        if (!this.layers[layer]){
            this.layers[layer] =  []
        }
        this.layers[layer].push(element)
        element.setLayer(layer)
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
        for (let layer of this.layers){
            for(let element of layer){
                if (element.haveMovementPoint()){
                    element.move(element.movementPoint.position)
                }
            }
        }
    }
    addEventController(eventController){
        this.events[eventController.eventName] = eventController
        return this
    }
    getEventController(name){
        return this.events[name]
    }
}