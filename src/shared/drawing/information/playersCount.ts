import p5 from "p5";
import { settingType } from "../../../entitieV2/Game/types";

export function playersCountDraw(p5: p5, settings: settingType, makeTurn: number, playersCount: number) {
    p5.push()
    let x = settings.width / 8
    let y = settings.height - 50
    p5.text(`${makeTurn} из ${playersCount} сделали свой ход`, x, y)
    p5.pop()
}