import p5 from "p5"
import { Block } from "../../../entitieV2/Block/model"
import { P5Element } from "../../../entitieV2/Element/model"
import { settingType, generalCoordinatesType, generalSizesType } from "../../../entitieV2/Game/types"



// Old. Depricated Ready
export function tipDraw(p5: p5, text:string, settings:settingType){
    let block = new Block(settings.width/2, 20, {height: 50, width: 300}, p5)
    block.draw()
    p5.textSize(14)
    p5.textAlign(p5.CENTER)
    p5.text(text, settings.width/2, 20)
}

export function tipCreate(p5: p5, text:string, settings:settingType){
    let tipBlock = new P5Element<generalCoordinatesType&generalSizesType>(p5, {x: settings.width/2, y: 25, height: 50, width: 300})
    tipBlock.defineDrawFn((variables: generalCoordinatesType&generalSizesType) => {
        p5.push()
        p5.rectMode(p5.CENTER)
        p5.fill('blue')
        p5.rect(variables.x, variables.y, variables.width, variables.height, 10)
        p5.textSize(14)
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.fill('black')
        p5.text(text, settings.width/2, 25)
        p5.pop()
    })
    return tipBlock
}