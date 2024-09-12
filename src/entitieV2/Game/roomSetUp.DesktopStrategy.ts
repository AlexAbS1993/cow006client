import p5 from "p5";
import { drawExitButtonFn, exitButtonDataType } from "../../shared/drawing/buttons/exitButton";
import { IRoomSetUpDeviceStrategyDrawing } from "./roomSetUp.types";
import { exitButtonVariablesType, generalCoordinatesType, settingType } from "./types";
import { P5Element } from "../Element/model";
import { Root } from "../Root/model";
import { fromClientToServerDataObjectType, messageFromClientTypes } from "../../const/messagesFromClient";

export class RoomDesktopStrategy implements IRoomSetUpDeviceStrategyDrawing {
    p5: p5
    root: Root
    roomId: string
    ws: WebSocket
    constructor(p5: p5, roomId: string, root:Root, ws: WebSocket){
        this.p5 = p5
        this.root = root
        this.roomId = roomId
        this.ws = ws
    }
    updateRoot(root: Root): void {
        this.root = root
        return
    }
    drawGreetings(settings: settingType, variables: { roomId: string; text: string; userName: string; }): void {
        let text = new P5Element(this.p5).defineDrawFn(() => {
            this.p5.push()
            this.p5.fill('white')
            this.p5.textSize(35)
            this.p5.textAlign(this.p5.CENTER)
            this.p5.text(`${variables.userName}! ` + "Добро пожаловать в комнату" + ` ${variables.roomId}`, settings.width / 2, 
                (settings.height / 2) - (settings.height  / 2 - 70))
            this.p5.pop()
        })
        this.root.addElement(text)
    }
    drawPlayersList(settings: generalCoordinatesType, variables: { orederNumber: number; isLeader: boolean; name: string; }): void {
        let {orederNumber, name, isLeader} = variables
        let {x, y} = settings
        let information = new P5Element(this.p5).defineDrawFn(() => {
            this.p5.push()
            this.p5.fill('white')
            this.p5.textAlign(this.p5.LEFT)
            this.p5.textSize(18)
            this.p5.text(`${orederNumber + 1}. ${name}_________________${isLeader ? "leader" : "______"}`,
                x + 10, y + ((orederNumber + 1) * 22)
            )
            this.p5.pop()
        })
        this.root.addElement(information)
    }
    drawExitButton(variables: typeof exitButtonDataType, icon?: p5.Image): void {
        let exitButton = new P5Element<exitButtonVariablesType>(this.p5, variables)
        exitButton.defineDrawFn((variables: exitButtonVariablesType & generalCoordinatesType) => {
            drawExitButtonFn(this.p5, variables, icon as p5.Image)
        })
        exitButton.defineMouseMoved((variables: exitButtonVariablesType) => {
            exitButton.setVariable('backgroundColor', 'red')
        })
        exitButton.defineUnMovedFn((variables: exitButtonVariablesType) => {
            exitButton.setVariable('backgroundColor', 'white')
        })
        exitButton.setUniqueId("exitButton")
        // Обработка нажати на кнопку выхода
        exitButton.defineMouseCliced(() => {
            let exitFromRoomDataObject: fromClientToServerDataObjectType = {
                token: localStorage.getItem('token') as string,
                type: messageFromClientTypes.exitTheRoom,
                data: {
                    roomFrom: this.roomId
                }
            }
            this.ws.send(JSON.stringify(exitFromRoomDataObject))
        })
        this.root.addElement(exitButton)
    }
    
}