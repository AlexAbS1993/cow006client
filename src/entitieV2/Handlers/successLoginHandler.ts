import { IUser } from "../Game/User/types";
import { IHandler, successLoginDataType } from "./types";

export class SuccessLoginHandler implements IHandler<void>{
    private token: string
    private login: string
    private id: string
    private userInfo: IUser
    private isItFirstTime: boolean
    constructor(data: successLoginDataType, userInfo: IUser, isItFirstTime: boolean){
        this.token = data.token
        this.login = data.login
        this.id = data.id
        this.userInfo = userInfo
        this.isItFirstTime = isItFirstTime
    }
    handle(){
        this.userInfo.setLogined()
        this.userInfo.setLogin(this.login)
        this.userInfo.setName(this.login)
        this.userInfo.setId(this.id)
        if (this.isItFirstTime){
            localStorage.setItem('token', this.token)
        }
    }
    
}

