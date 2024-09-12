import { IPlayer, cardType } from "./interface";

export class Player implements IPlayer{
    name: string;
    id: string;
    inRoom: boolean;
    inGame: boolean;
    leaderOfRoom: string | null;
    pool: cardType[];
    private hand: cardType[]
    constructor(id:string, name:string){
        this.id = id
        this.name = name
        this.inGame = false
        this.inRoom = true
        this.leaderOfRoom = null
        this.pool = []
        this.hand = []
    }
    getCardFromHand(nO: number): cardType |null{  
        return this.hand.find(card => card.nominal === nO) || null
    }
    getHand(): cardType[] {
        return this.hand
    }
    setLeader(roomId: string): void {
        this.leaderOfRoom = roomId
        return
    }    
    definePool(pool: cardType[]): void {
        this.pool = pool
        return
    }
    getPool(): cardType[] {
        return this.pool
    }
    
}