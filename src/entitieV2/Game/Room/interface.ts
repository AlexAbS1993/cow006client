import { IPlayer } from "../Player/interface";

export interface IRoom{
    roomId: string
    players: IPlayer[]|null
    leader: IPlayer|null
    getRoomId(): string
    getPlayers(): IPlayer[]
    getLeader(): IPlayer|null
    addPlayer(player: IPlayer): void
    setLeader(player: IPlayer): void
    getPlayerById(id: string): IPlayer
    isGameStarted():boolean
    setGameEnd():void
    setGameStarted(): void
    deletePlayer(id: string): void
}