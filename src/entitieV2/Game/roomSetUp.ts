import p5 from "p5"
import { Game } from "./model"
import { exitButtonVariablesType, generalCoordinatesType, settingType } from "./types"
import { Root } from "../Root/model"
import { P5Element } from "../Element/model"
import { Block } from "../Block/model"
import { EventsEnum } from "./Events/events.type"
import { EventController } from "../../entities/Events/eventController.js"
import { GameMods, fromClientToServerDataObjectType, messageFromClientTypes } from "../../const/messagesFromClient"
import { tipShowAction } from "../../actions/tipShowActions"
import { tipCreate, tipDraw } from "../../shared/drawing/tip/Tip"
import { IRoomSetUpDeviceStrategyDrawing } from "./roomSetUp.types"
import { DrawManager } from "../../managers/drawManager"
import { exitButtonDataType } from "../../shared/drawing/buttons/exitButton"

export class RoomSetUp {
    p5: p5
    settings: settingType
    elements: p5.Element[]
    game: Game
    loading: boolean
    roomId: string
    alreadyInRoom: boolean
    backgroundImage: p5.Image | null
    exitIcon: p5.Image | null
    deviceStrategy: IRoomSetUpDeviceStrategyDrawing
    constructor(p5: p5, game: Game, settings: settingType, deviceStrategy: IRoomSetUpDeviceStrategyDrawing) {
        this.p5 = p5
        this.settings = settings
        this.elements = []
        this.game = game
        this.loading = true
        this.roomId = game.room?.getRoomId() as string
        this.alreadyInRoom = false
        this.backgroundImage = null
        this.exitIcon = null
        this.deviceStrategy = deviceStrategy 
    }
    execute() {
        this.game.setRoot(new Root())
        this.deviceStrategy.updateRoot(this.game.root as Root)
        let windowHeigth = this.settings.height
        let windowWidth = this.settings.width
        if (!this.alreadyInRoom) {
            // Если впервые загружается комната
            // Кнопка копирования
            // Общее для всех размеров
            let copyButton = this.p5.createButton('Copy RoomId')
            copyButton.style('display: none')
            copyButton.attribute('id', 'copyButton')
            copyButton.position(20, (windowHeigth / 2) - (windowHeigth / 2 - 110))
            copyButton.mouseClicked(() => {
                navigator.clipboard.writeText(this.game.room?.getRoomId() as string)
                tipShowAction(this.game.root as Root, tipCreate(this.p5, 'Номер комнаты успешно скопирован', this.settings))

            })
            this.game.elements.push(copyButton)
            // Экран загрузки 
            // Общее для всех размеров
            let loading = new P5Element(this.p5)
            loading.defineDrawFn(() => {
                this.p5.push()
                this.p5.rectMode(this.p5.CORNER)
                this.p5.fill('rgb(255, 255, 255)')
                this.p5.rect(0, 0, this.settings.width, this.settings.height)
                this.p5.textAlign(this.p5.CENTER)
                this.p5.fill('black')
                this.p5.text('Загрузка', this.settings.width / 2, this.settings.height / 2)
                this.p5.pop()
            })
            loading.setUniqueId("loading")
            this.game.root?.addElement(loading, 3)
                 // Подгрузка картинок
            // let randomNumber = Math.floor(Math.random() * 5)
            let randomNumber = 2
            let backImage = new Promise((res, rej) => {
                this.backgroundImage = this.p5.loadImage(`./source/dist/img/backInRoom${randomNumber}.gif`, () => {
                    res(null)
                })
            })
            let icon = new Promise((res, rej) => {
                this.exitIcon = this.p5.loadImage('./source/dist/img/exit.png', () => {
                    res(null)
                })
            })
            this.alreadyInRoom = true
            Promise.all([backImage, icon]).then(() => {
                this.game.root?.deleteElement('loading', 3)
                this.loading = false
                copyButton.style('display: block')
            })
        }
        // Эвенты
        let clickEventController = new EventController(EventsEnum.mouseClicked)
        this.game.root?.addEventController(clickEventController)
        let overEvent = new EventController(EventsEnum.mouseMoved)
        this.game.root?.addEventController(overEvent)
        // Создание фона
        // Общее для всех размеров
        let backGround = new P5Element(this.p5)
            .defineDrawFn(() => {
                this.p5.push()
                this.p5.image(this.backgroundImage as p5.Image, 0, 0, this.settings.width, this.settings.height)
                this.p5.pop()
            })
        this.game.root?.addElement(backGround)
        // Меню
        let roomWindow = new Block(windowWidth / 2, windowHeigth / 2, {
            width: Math.max(windowWidth / 2, 375), heigth: windowHeigth / 2, id: "room_menu", style: {
                backgroundColor: 'rgba(227, 93, 93, 0.7)'
            }
        }, this.p5)
        this.game.root?.addElement(roomWindow)
        // Добавляем текст с приветствием
        // Рисуем приветствие в зависимости от размеров нашего экрана
        this.deviceStrategy
        .drawGreetings(this.settings, {roomId:this.game.room!.getRoomId(), userName: this.game.userInfo.name as string, text:  "Добро пожаловать в комнату"})
        // Берем игроков и отрисовываем их положением в окне списком
        let players = this.game.room?.getPlayers()!
        // В целом можно и так оставить
        let roomWindowXLeft = windowWidth / 2 - roomWindow.width / 2
        let roomWindowYTop = windowHeigth / 2 - roomWindow.height / 2
        for (let i = 0; i < players.length; i++) {
            this.deviceStrategy
            .drawPlayersList({x: roomWindowXLeft, y: roomWindowYTop}, {
                orederNumber: i,
                name: players[i].name,
                isLeader: this.game.room?.getLeader()?.id === players[i].id
            })
        }
        // Кнопка выхода из комнаты
        // Разное местоположение кнопки
        let exitButtonData = {...exitButtonDataType}
        this.deviceStrategy
        .drawExitButton(exitButtonData, this.exitIcon as p5.Image)
        let exButton = this.game.root?.getElementByUniqueId('exitButton')
        clickEventController.addListener(exButton)
        overEvent.addListener(exButton)
        // Кнопка запуска игры для leader
        // Одинаково для всех размеров
        if (this.game.room?.getLeader()?.id === this.game.userInfo.id) {
            let startButtonX = roomWindowXLeft + 50
            let startButtonY = roomWindowYTop + roomWindow.height - 50
            let startTheGameButton = new P5Element<exitButtonVariablesType & { playersCount: number }>(this.p5,
                {
                    playersCount: this.game.room!.getPlayers().length, x: startButtonX, y: startButtonY,
                    backgroundColor: 'rgba(140, 135, 135, 0.43)', normRadius: 50, maxRadius: 50, width: 50, height: 50
                })
            startTheGameButton.defineDrawFn((variables: exitButtonVariablesType & generalCoordinatesType & { playersCount: number }) => {
                this.p5.push()
                this.p5.noStroke()
                if (variables.playersCount < 2) {
                    variables.backgroundColor = 'rgba(140, 135, 135, 0.43)'
                }
                else {
                    variables.backgroundColor = 'rgb(17, 245, 66)'
                }
                this.p5.fill(variables.backgroundColor)
                this.p5.circle(variables.x, variables.y, variables.normRadius)
                this.p5.pop()
            })
            startTheGameButton.defineMouseCliced((variables: exitButtonVariablesType & generalCoordinatesType & { playersCount: number }) => {
                if (variables.playersCount < 2) {
                    let tip = new P5Element(this.p5).defineDrawFn(() => {
                        tipDraw(this.p5, "Недостаточно игроков для начала игры", this.settings)
                    })
                    tipShowAction(this.game.root as Root, tip)
                }
                else {
                    let dataForSend: fromClientToServerDataObjectType = {
                        token: localStorage.getItem("token") as string,
                        type: messageFromClientTypes.startTheGame,
                        data: {
                            mode: GameMods.tactic
                        }
                    }
                    this.game.webS?.send(JSON.stringify(dataForSend))
                }
            })
            startTheGameButton.setUniqueId("StartTheGame")
            clickEventController.addListener(startTheGameButton)
            this.game.root?.addElement(startTheGameButton)
        }
    }
}