import p5 from "p5";

type drawLeftAreaSettingsType = {
    leftRowsAreaWidth: number,
    leftRowsAreaHeigth: number
}

export function drawLeftArea(p5: p5, settings:drawLeftAreaSettingsType){
    p5.push()
    p5.rectMode(p5.CORNER)
    p5.noFill()
    p5.stroke('black')
    p5.strokeWeight(2)
    p5.rect(10, 10, settings.leftRowsAreaWidth, settings.leftRowsAreaHeigth, 20)
    p5.pop()
}