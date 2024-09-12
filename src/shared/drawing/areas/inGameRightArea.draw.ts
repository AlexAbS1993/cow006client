import p5 from "p5";

export type drawRightAreaSettingsType = {
    rigthHandAndPoolAreaX: number,
    rigthHandAndPoolAreaY: number,
    rigthHandAndPoolAreaWidth: number,
    rigthHandAndPoolAreaHeigth: number
}

export function drawRightArea(p5:p5, settings:drawRightAreaSettingsType){
    p5.push()
    p5.rectMode(p5.CORNER)
    p5.stroke('black')
    p5.strokeWeight(2)
    p5.noFill()
    p5.rect(settings.rigthHandAndPoolAreaX, settings.rigthHandAndPoolAreaY, settings.rigthHandAndPoolAreaWidth, settings.rigthHandAndPoolAreaHeigth, 20)
    p5.pop()
}