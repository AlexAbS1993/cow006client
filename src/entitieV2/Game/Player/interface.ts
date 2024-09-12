export interface IPlayer {
    name: string
    id: string
    inRoom: boolean
    inGame: boolean
    leaderOfRoom: string|null
    getCardFromHand(nO: number):cardType|null
    getHand(): cardType[]
    setLeader(roomId: string): void
    pool: cardType[]
    definePool(pool:cardType[]):void
    getPool():cardType[]
}

export type cardType = {
    nominal: number,
    badPoints: number
}