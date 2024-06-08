class EventController{
    constructor(eventName){
        this.listeners = []
        this.eventName = eventName
        this.strategies = {}
    }
    addStrategy(strategy, name){
        this.strategies[name] = strategy
    }
    addListener(candidate){
        if (!this.listeners.some(listener => listener.id === candidate.id)){
            this.listeners.push(candidate)
        }  
    }
    check(mX, mY, gl){
        let currentLayerCheck = gl.layers.length - 1
        while (currentLayerCheck >= 0){
            for( let listener of this.listeners){
                if (listener.getCurrentLayer() === currentLayerCheck){
                    let listenerIsOn = listener[this.eventName](mX, mY, gl, this.strategies)
                    if (listenerIsOn){
                        return
                    }
                }
            } 
            currentLayerCheck-- 
        }        
    }
}