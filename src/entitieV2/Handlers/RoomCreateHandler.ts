import { roomCreatedResponseFromServerDataType } from "../../const/datasFromServer";
import { Player } from "../Game/Player/model";
import { IRoom } from "../Game/Room/interface";
import { Room } from "../Game/Room/model";
import { IUser } from "../Game/User/types";
import { IHandler } from "./types";

export class RoomCreateHandler implements IHandler<IRoom> {
    private roomId: string
    private userName: string
    private userId: string
    constructor(data: roomCreatedResponseFromServerDataType, userInfo: IUser) {
        this.roomId = data.roomId
        this.userName = userInfo.name as string
        this.userId = userInfo.id as string
    }
    handle(): IRoom {
        let room = new Room(this.roomId)
        let playerCreatedRoom = new Player(this.userId, this.userName)
        room.addPlayer(playerCreatedRoom)
        room.setLeader(playerCreatedRoom)
        return room
    }
}
