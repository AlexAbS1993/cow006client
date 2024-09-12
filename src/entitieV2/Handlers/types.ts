import { IUser } from "../Game/User/types"

export interface IHandler<RT> {
    handle():RT
}

export type successLoginDataType =  {token: string, login: string, id: string}