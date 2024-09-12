import { IPlayer } from "../Player/interface";
import { IRoom } from "./interface";

export class Room implements IRoom {
    constructor(id: string){
        this.players = []
        this.leader = null
        this.roomId = id
        this.gameStarted = false
        this.gameEnd = false
    }
    deletePlayer(id: string): void {
        this.players = this.players.filter(player => player.id !== id)
        return
    }
    setGameEnd(){
        this.gameStarted = false
        this.gameEnd = true
        return
    }
    setGameStarted(){
        this.gameStarted = true
        return
    }
    isGameStarted(): boolean {
       return this.gameStarted
    }
    getPlayerById(id: string): IPlayer {
        return this.players.find(player => player.id === id) as IPlayer
    }
    setLeader(player: IPlayer): void {
        this.leader = player
        player.setLeader(this.roomId)
    }
    getPlayers(): IPlayer[] {
        return this.players
    }
    getLeader(): IPlayer|null {
        return this.leader
    }
    addPlayer(player: IPlayer): void {
        this.players.push(player)
    }
    getRoomId(): string {
        return this.roomId
    }
    players: IPlayer[];
    leader: IPlayer|null;
    roomId: string;
    gameStarted: boolean
    gameEnd: boolean
}