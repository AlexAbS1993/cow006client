import p5 from 'p5'
import {Root} from '../Root/model'
import { MenuSetUp } from './menuSetUp'
import {  expectedParsedDataType, poolType, settingType } from './types'
import { RoomSetUp } from './roomSetUp'
import { P5Element } from '../Element/model'
import { tipCreate, tipDraw } from '../../shared/drawing/tip/Tip'
import { greetingsAction } from '../../actions/greetingsAction'
import { tipShowAction } from '../../actions/tipShowActions'
import { messageFromServerEnum } from '../../const/messagesFromServer'
import { messageFromClientTypes } from '../../const/messagesFromClient'
import { cardFromPoolToRowPlacedSuccessfully, 
    gameStartedResponseFromServerDataType, 
    playersDataForResponseFromServerDataType, 
    resultEndGameType, rowsDataForResponseFromServerDataType, 
    switchToCheckMessageFromServerPoolDataType } from '../../const/datasFromServer'
import { Room } from './Room/model'
import { Player } from './Player/model'
import { IRoom } from './Room/interface'
import { Block } from '../Block/model'
import { IPlayer } from './Player/interface'
import { GameSetUp } from './gameSetUp'
import { Select } from '../../entities/select'
import {  playersCountDraw } from '../../shared/drawing/information/playersCount'
import { TimeOutManager } from '../../managers/timeoutManager'
import { SuccessLoginHandler } from '../Handlers/successLoginHandler'
import { IUser } from './User/types'
import { PlayerMakesTurnHandler } from '../Handlers/playerMakesTurnHandler'
import { RoomCreateHandler } from '../Handlers/RoomCreateHandler'
import { DrawManager } from '../../managers/drawManager'

export class Game{
    state: string
    p5: p5
    root:null|Root
    settings: settingType
    gameId: string|null
    room: IRoom|null
    webS: WebSocket|null
    elements: p5.Element[]
    readyToWork: boolean
    blockedUI: boolean
    loading: boolean
    currentSetup: any
    gameData: gameStartedResponseFromServerDataType |null
    select: Select
    timeOutManager: TimeOutManager
    userInfo: IUser
    constructor(p5: p5, settings:settingType, user: IUser){
        this.readyToWork = false
        this.state = 'menu'
        this.elements = []
        this.p5 = p5
        this.root = new Root()
        this.userInfo = user
        this.settings = settings
        this.gameId = null
        this.room = null
        this.webS = null
        this.blockedUI = false
        this.loading = true
        this.currentSetup = null
        this.gameData = null
        this.select = new Select()
        this.timeOutManager = new TimeOutManager()
    }
    setBlockedUI(value: boolean){
        this.blockedUI = value
        return
    }
    unblockElements(){
        this.elements.forEach(htmlElement =>  htmlElement.elt.disabled = false)
    }
    setGameId(gameId: string){
        this.gameId = gameId
        return
    }
    setState(state:string){
        this.state = state
        return
    }
    setRoot(root: Root){
        this.p5.clear()
        this.root = root
    }
    getRoot(){
        return this.root
    }
    connect(){
        let web = new WebSocket('ws://localhost:3000');
        this.webS = web
        this.webS.onopen = () => {
            console.log("Соединение открыто")
            let startedData = {
                token: localStorage.getItem('token'),
                type: messageFromClientTypes.iAmInAlready
            }
            this.webS?.send(JSON.stringify(startedData))
        }
        this.webS.onmessage = (event) => {
            let parsedMessageData:expectedParsedDataType = JSON.parse(event.data)
            switch (parsedMessageData.type) {
                case "greetings": {
                    greetingsAction(parsedMessageData.data)
                    break
                }
                case messageFromServerEnum.iAmInAlready: {
                    this.readyToWork = true
                    if (parsedMessageData.success){
                        let {inRoomId} = parsedMessageData.data
                        new SuccessLoginHandler(parsedMessageData.data, this.userInfo, false)
                        .handle()
                        if (inRoomId){
                            this.setState("doubleApp")
                        }
                        this.setUp()
                    }
                    else {
                        this.setUp()
                    }
                 break
                }
                case messageFromServerEnum.successRegistred:{
                    tipShowAction(this.root as Root, tipCreate(this.p5, parsedMessageData.message, this.settings))
                    break
                }
                case messageFromServerEnum.alreadyRegistred: {
                    tipShowAction(this.root as Root, tipCreate(this.p5, parsedMessageData.message, this.settings))
                    break
                }
                case messageFromServerEnum.logInWrongDatas: {
                    tipShowAction(this.root as Root, tipCreate(this.p5, parsedMessageData.message, this.settings))
                    break
                }
                case messageFromServerEnum.successLogIn: {
                    new SuccessLoginHandler(parsedMessageData.data, this.userInfo, true)
                    .handle()
                    for (let element of this.elements) {
                        element.elt.parentNode.removeChild(element.elt)
                    }
                    this.elements = []
                    this.setUp()
                    let tip = new P5Element(this.p5).defineDrawFn(() => {
                        tipDraw(this.p5, parsedMessageData.message, this.settings)
                    })
                    tipShowAction(this.root as Root, tip)
                    break
                }
                case messageFromServerEnum.validationRegistrationError: {
                    let tip = new P5Element(this.p5).defineDrawFn(() => {
                        tipDraw(this.p5, parsedMessageData.message, this.settings)
                    })
                    tipShowAction(this.root as Root, tip)
                    break
                } 
                case messageFromServerEnum.roomCreated: {
                    if (!parsedMessageData.success){
                        if (parsedMessageData.message === `Вы уже находитесь в комнате`){
                            let tip = new P5Element(this.p5).defineDrawFn(() => {
                                tipDraw(this.p5, parsedMessageData.message, this.settings)
                            })
                            tipShowAction(this.root as Root, tip)
                        }
                        break
                    }
                    let room = new RoomCreateHandler(parsedMessageData.data, this.userInfo)
                    .handle()
                    this.room = room
                    this.setState("room")
                    for (let element of this.elements) {
                        element.elt.parentNode.removeChild(element.elt)
                    }
                    this.elements = []
                    this.setUp()
                    break
                }            
                case messageFromServerEnum.userConnectToRoom: {
                    let players: {
                        id: string, 
                        name: string}[] = parsedMessageData.data.players
                    let newPlayersInfo: {
                        id: string, 
                        name: string} =   parsedMessageData.data.newPlayer
                    let roomId = parsedMessageData.data.roomId
                    let leaderId = parsedMessageData.data.leader
                    let newPlayer = new Player(newPlayersInfo.id, newPlayersInfo.name)
                    if (this.room){
                        this.room!.addPlayer(newPlayer)
                        this.currentSetup.execute()
                    } 
                    else {
                        this.setState("room")
                        for (let element of this.elements) {
                            element.elt.parentNode.removeChild(element.elt)
                        }
                        this.elements = []
                        this.room  = new Room(roomId)
                        for (let player of players){
                            let rommate = new Player(player.id, player.name)
                            this.room.addPlayer(rommate)
                            if (player.id === leaderId){
                                this.room.setLeader(rommate)
                            }
                        }
                        this.setUp()
                    }
                    
                    let tip = new P5Element(this.p5).defineDrawFn(() => {
                        tipDraw(this.p5, parsedMessageData.message, this.settings)
                    })
                    tipShowAction(this.root as Root, tip)
                    break
                }
                case messageFromServerEnum.roomIsNotExists: {
                    if (this.blockedUI){
                        this.setBlockedUI(false)
                        this.unblockElements()
                    }
                    let tip = new P5Element(this.p5).defineDrawFn(() => {
                        tipDraw(this.p5, parsedMessageData.message, this.settings)
                    })
                    tipShowAction(this.root as Root, tip)
                    break
                }   
                case messageFromServerEnum.userHasBeenLeave: {
                    let dataFromServer: Pick<playersDataForResponseFromServerDataType, 'name'|'id'>&{leaderId: string} = parsedMessageData.data
                    let leader = this.room?.getPlayerById(dataFromServer.leaderId) as IPlayer
                    if (dataFromServer.id === this.userInfo.id){
                        this.room = null
                        this.setState('menu')
                        this.setUp()
                        let tip = new P5Element(this.p5).defineDrawFn(() => {
                            tipDraw(this.p5, parsedMessageData.message, this.settings)
                        })
                        tipShowAction(this.root as Root, tip)
                    }
                    else {
                        this.room?.deletePlayer(dataFromServer.id)
                        this.room?.setLeader(leader)
                        this.currentSetup.execute()
                        let tip = new P5Element(this.p5).defineDrawFn(() => {
                            tipDraw(this.p5, parsedMessageData.message, this.settings)
                        })
                        tipShowAction(this.root as Root, tip)
                    }
                    
                    break
                }
                case messageFromServerEnum.gameStarted: {
                    let data: gameStartedResponseFromServerDataType = parsedMessageData.data
                    this.gameData = data
                    this.setGameId(data.id)
                    this.setState("game")
                    this.setUp()
                    break
                }
                case messageFromServerEnum.GameEndsPlayerLeaves: {
                    let data: {userId: string} = parsedMessageData.data
                    // Пока ничего не делаем с полученными данными. Просто отводим персонажа обратно в меню
                    this.setState("menu")
                    this.setUp()
                    let tip = new P5Element(this.p5).defineDrawFn(() => {
                        tipDraw(this.p5, parsedMessageData.message, this.settings)
                    })
                    tipShowAction(this.root as Root, tip)
                    break
                }
                case messageFromServerEnum.playerMakesTurn: {
                    let currentSetUp: GameSetUp = this.currentSetup
                    new PlayerMakesTurnHandler(currentSetUp, parsedMessageData.data)
                    let tip = new P5Element(this.p5).defineDrawFn(() => {
                        tipDraw(this.p5, parsedMessageData.message, this.settings)
                    })
                    tipShowAction(this.root as Root, tip)
                    let playersMakeTurnCount = currentSetUp.playersMakeTurn.length
                    let playersOverAll = currentSetUp.players.length
                    let reportOfCountPlayersMakeTurn = new P5Element(this.p5).defineDrawFn(() => {
                        playersCountDraw(this.p5, this.settings,playersMakeTurnCount, playersOverAll)
                    })
                    reportOfCountPlayersMakeTurn.setUniqueId("countOfPlayersMakeTurn")
                    this.root?.addElement(reportOfCountPlayersMakeTurn)
                    break
                }
                case messageFromServerEnum.afterTurnSwitchToCheck: {
                    let currentSetUp:GameSetUp = this.currentSetup
                    currentSetUp.clearPlayersMakeTurn()
                    currentSetUp.setStage('poolChecking')
                    let data: switchToCheckMessageFromServerPoolDataType = parsedMessageData.data
                    let poolData:poolType = data.map(player => {
                        let result = {id: player.playerId, name: '', badPoints:player.badPoint, nominal: player.nominal}
                        let playerName = currentSetUp.players.find(pl => pl.id === player.playerId)!.name
                        if (!playerName){
                            throw new Error('Игрок не найден')
                        }
                        result.name = playerName as string
                        return result
                    })
                    currentSetUp.setUpPool(poolData)
                    currentSetUp.execute()
                    break
                }
                case messageFromServerEnum.fromPoolToRowSucces: {
                    let currentSetUp:GameSetUp = this.currentSetup
                    if (currentSetUp.stage === 'rowSelection'){
                        currentSetUp.setStage('poolChecking')
                        currentSetUp.fromSelection = true
                        currentSetUp.execute()
                    }
                    let data: cardFromPoolToRowPlacedSuccessfully = parsedMessageData.data 
                    let rows: rowsDataForResponseFromServerDataType[] = data.rows
                    let currentCardNo = currentSetUp.pool[currentSetUp.checkedIndex].nominal
                    let currentCardId = currentSetUp.pool[currentSetUp.checkedIndex].id
                    let currentCard:any = this.root!.getElementByUniqueId(currentCardId)
                    currentCard.letBeMovable()
                    let rowIndex = 0
                    let cardIndex = 0
                    rows.forEach((row, rIndex) => {
                        row.forEach((card, cIndex) => {
                            if (card?.nominal === currentCardNo){
                                rowIndex = rIndex
                                cardIndex = cIndex
                            }
                        })
                    })
                    let x = currentSetUp.rowsSchema[rowIndex][cardIndex].x
                    let y = currentSetUp.rowsSchema[rowIndex][cardIndex].y
                    let abstractPoint = new P5Element(this.p5, {x, y})
                    let fromToMinus = p5.Vector.sub(currentCard.position, abstractPoint.position)
                    let mag = this.p5.mag(fromToMinus.x, fromToMinus.y)
                    let speed = mag/120
                    currentCard.velLimit = this.p5.max(speed, 5)
                    this.root!.moveManager.registrate(currentCard, abstractPoint.position)
                       this.timeOutManager.addToStack(() => {
                        currentSetUp.fromSelection = false
                        currentSetUp.playersIdSelectRow = null
                        let currentPlayer = currentSetUp.players.find(player => player.id === data.playersId) as playersDataForResponseFromServerDataType
                        currentPlayer!.hand = currentPlayer?.hand.filter(card => card.nominal !== data.cardN)
                        currentSetUp.rows = rows
                        currentSetUp.checkedIndex += 1
                        currentSetUp.execute()
                        if (currentPlayer.hand.length === 0){
                            currentSetUp.execute()
                        }
                       }, 2)
                    break
                }
                case messageFromServerEnum.switchToProcess: {
                    let currentSetUp:GameSetUp = this.currentSetup
                    if (currentSetUp.stage === 'rowSelection'){
                        currentSetUp.setStage('poolChecking')
                        currentSetUp.fromSelection = true
                        currentSetUp.execute()
                    }
                    let data: cardFromPoolToRowPlacedSuccessfully = parsedMessageData.data 
                    let rows: rowsDataForResponseFromServerDataType[] = data.rows
                    let currentCardNo = currentSetUp.pool[currentSetUp.checkedIndex].nominal
                    let currentCardId = currentSetUp.pool[currentSetUp.checkedIndex].id
                    let currentCard:any = this.root!.getElementByUniqueId(currentCardId)
                    currentCard.letBeMovable()
                    let rowIndex = 0
                    let cardIndex = 0
                    rows.forEach((row, rIndex) => {
                        row.forEach((card, cIndex) => {
                            if (card?.nominal === currentCardNo){
                                rowIndex = rIndex
                                cardIndex = cIndex
                            }
                        })
                    })
                    let x = currentSetUp.rowsSchema[rowIndex][cardIndex].x
                    let y = currentSetUp.rowsSchema[rowIndex][cardIndex].y
                    let abstractPoint = new P5Element(this.p5, {x, y})
                    this.root!.moveManager.registrate(currentCard, abstractPoint.position)
                    let fromToMinus = p5.Vector.sub(currentCard.position, abstractPoint.position)
                    let mag = this.p5.mag(fromToMinus.x, fromToMinus.y)
                    let speed = mag/120
                    currentCard.velLimit = this.p5.max(speed, 5)
                    this.timeOutManager.addToStack(() => {
                        let currentPlayer = currentSetUp.players.find(player => player.id === data.playersId) as playersDataForResponseFromServerDataType
                        currentPlayer!.hand = currentPlayer?.hand.filter(card => card.nominal !== data.cardN)
                        currentSetUp.rows = rows
                        currentSetUp.checkedIndex = 0
                        currentSetUp.setStage("cardSelection")
                        currentSetUp.execute()
                    }, 2)     
                    break
                }
                case messageFromServerEnum.needToSelectRow: {
                        let currentSetUp:GameSetUp = this.currentSetup
                        let data: Pick<cardFromPoolToRowPlacedSuccessfully, 'playersId'> = parsedMessageData.data 
                        currentSetUp.setStage("rowSelection")
                        currentSetUp.playersIdSelectRow = data.playersId
                        currentSetUp.execute()
                    break
                }
                case messageFromServerEnum.endGameReady: {
                    this.timeOutManager.addToStack(() => {
                        let currentSetUp:GameSetUp = this.currentSetup
                        let data:resultEndGameType = parsedMessageData.data
                        currentSetUp.endGameResult = data
                        currentSetUp.setStage("end")
                        currentSetUp.execute()
                    }, 1) 
                    break
                }
                 default: {
                    break
                }
            }
        }
        this.webS.onclose = function(event) {
            if (event.wasClean) {
              console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                console.log('[close] Соединение прервано');
            }
          };
    }
    setUp(){ 
        if(!this.readyToWork){
            return
        }
        this.setRoot(new Root())
        this.elements.forEach((element) => {
            element.elt.parentNode.removeChild(element.elt)
        })
        this.elements = []
        switch(this.state){
            case "doubleApp":{
                this.setRoot(new Root())
                this.p5.push()
                this.p5.rectMode(this.p5.CORNER)
                let block = new Block(0, 0, {width: this.settings.width *2, heigth: this.settings.height*2, style: {backgroundColor: 'rgb(23, 20, 20)'}}, this.p5)
                this.p5.pop()
                this.root?.addElement(block, 0)
                let textEl = new P5Element(this.p5)
                textEl.defineDrawFn(() => {
                    this.p5.push()
                this.p5.fill('white')
                this.p5.textAlign(this.p5.CENTER)
                this.p5.text("Открыто два приложения. Вернитесь на уже имеющуюся вкладку", this.settings.width/2, this.settings.height/2)
                this.p5.pop()
                })
                this.root?.addElement(textEl)
                break
            }
            case "menu":{
                this.currentSetup = new MenuSetUp(this.p5, this, this.settings)
                this.currentSetup.execute()
                break
            }
            case "room": {
                let DeviceDisplaySizeStrategy = new DrawManager(this.settings).getRoomSetUpDrawing()
                this.currentSetup = new RoomSetUp(this.p5, this, this.settings, 
                    new DeviceDisplaySizeStrategy(this.p5, 
                    this.room?.getRoomId() as string, 
                    this.getRoot() as Root, 
                    this.webS as WebSocket))
                this.currentSetup.execute()
                break
            }
            case "game": {
                this.currentSetup = new GameSetUp(this.p5, this, this.settings)
                this.currentSetup.execute()
                break
            }
            default: {
                break
            }
        }
    }
    setLogined(){
        return this.userInfo.setLogined()
    }
    setUnlogined(){ 
        return this.userInfo.setUnlogined()
    }
    setLogin(login: string){       
        return this.userInfo.setLogin(login)
    }
    setId(id: string){
        return this.userInfo.setId(id)
    }
    setName(name: string){
        return this.userInfo.setName(name)
    }
}