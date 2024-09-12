import { IUser } from "./types";

export class UserInfo implements IUser {
    login: string | null;
    logined: boolean;
    id: string | null;
    name: string | null;
    constructor(){
        this.login = null
        this.logined = false
        this.id = null
        this.name = null
    }
    setLogined(): void {
        this.logined = true
        return
    }
    setUnlogined(): void {
        this.logined = false
        this.login = null
        this.id = null
        return
    }
    setLogin(login: string): void {
        this.login = login
        return
    }
    setId(id: string): void {
        this.id = id
        return
    }
    setName(name: string): void {
        this.name = name
        return
    }
    
}