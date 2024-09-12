import { playersMakeTurnDataTypeResonseFromServer } from "../../const/datasFromServer";
import { GameSetUp } from "../Game/gameSetUp";
import { playerMakeTurnType } from "../Game/types";
import { IHandler } from "./types";

export class PlayerMakesTurnHandler implements IHandler<void> {
    private currentSetUp: GameSetUp
    private data: playersMakeTurnDataTypeResonseFromServer
    constructor(currentSetUp: GameSetUp, data: playersMakeTurnDataTypeResonseFromServer){
        this.currentSetUp = currentSetUp
        this.data = data
    }
    handle(): void {
        let player = this.currentSetUp.players.find(player =>  this.data.playerTurn === player.id) as playerMakeTurnType
        this.currentSetUp.addToPlayersMakeTurn({name: player?.name, id: player?.id})
    }
}