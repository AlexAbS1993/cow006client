import p5 from "p5"
import { IElement } from "../entitieV2/Element/interface"

export class MoveManager{
    elements: IElement[]
    constructor(){
        this.elements = []
    }
    registrate(element: IElement, targetPoint: p5.Vector){
        if (!element.movable){
            return
        }
        element.movementPoint = targetPoint
        this.elements.push(element)
        return this
    }
    move(){
        this.elements.forEach(el => el.move(el.movementPoint!))
        return this
    }
    unRegistrate(id: string){
        this.elements = this.elements.filter(el => el.getId() !== id)
        return this
    }
}