import p5 from "p5";

export function drawNoOpacityBackground(p5: p5, settings: any){
    p5.push()
    p5.rectMode(p5.CORNER)
    p5.fill('rgb(135, 183, 237)')
    p5.noStroke()
    p5.rect(0, 0, settings.width, settings.height)
    p5.pop()
}