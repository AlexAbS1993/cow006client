export interface IUser {
    login: string|null
    logined: boolean
    id: string|null
    name: string|null
    setLogined():void
    setUnlogined():void
    setLogin(login: string):void
    setId(id: string): void
    setName(name: string): void
}