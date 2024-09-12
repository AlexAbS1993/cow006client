import p5 from "p5";

export type drawCardInRowSettingsType = {
    rows: any[]
    rowIndex: number,
    cardIndex: number,
    x: number,
    y: number,
    cardWidth: number,
    cardHeight: number,
    glasses: p5.Image,
    backGround: p5.Image
}

export function drawCardInRow(p5: p5, settings: drawCardInRowSettingsType) {
    let { rows, rowIndex, cardIndex, x, y, cardHeight, cardWidth, glasses, backGround } = settings
    p5.push()
    p5.rectMode(p5.CORNER)
    p5.stroke('black')
    p5.strokeWeight(1)
    if (rows[rowIndex][cardIndex] !== null) {
        p5.image(backGround, x, y, cardWidth, cardHeight)
        p5.noFill()
        p5.noStroke()
        p5.rect(x, y, cardWidth, cardHeight, 15)
        p5.fill('black')
        p5.textSize(20)
        p5.text(`${rows[rowIndex][cardIndex]?.nominal}`, x + 15, y + cardHeight -  25)
        p5.textSize(16)
        p5.text(`${rows[rowIndex][cardIndex]?.badPoint} х `, x + cardWidth - 40, y +20)
        p5.image(glasses, x + cardWidth - 25, y + 5, 20, 20)
    }
    else {
        p5.fill('rgba(255, 255, 255, 0)')
        p5.rect(x, y, cardWidth, cardHeight, 5)
    }
    p5.pop()
}