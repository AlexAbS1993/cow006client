import p5 from "p5";
import { Game } from "./model";
import { cardType, cardVariablesType, exitButtonVariablesType, extendedCardVariablesType, gameStageType, generalCoordinatesType, playerMakeTurnType, poolType, settingType } from "./types";
import { playersDataForResponseFromServerDataType, rowsDataForResponseFromServerDataType } from "../../const/datasFromServer";
import { Root } from "../Root/model";
import { P5Element } from "../Element/model";
import { Select } from "../../entities/select";
import { EventController } from "../../entities/Events/eventController";
import { EventsEnum } from "./Events/events.type";
import { drawNoOpacityBackground } from "../../shared/drawing/backgrounds/inGameBackground.draw";
import { drawLeftArea } from "../../shared/drawing/areas/inGameLeftArea.draw";
import { drawRightArea } from "../../shared/drawing/areas/inGameRightArea.draw";
import { drawCardInRow } from "../../shared/drawing/cards/inGameCardInRow.draw";
import { checkCardFromPoolType, fromClientToServerDataObjectType, messageFromClientTypes, playerMakesTurn, tokenDataType } from "../../const/messagesFromClient";
import { Block } from "../Block/model";
import { rowSchemaType } from "./gameSetUp.types";
import { drawExitButtonFn, exitButtonDataType } from "../../shared/drawing/buttons/exitButton";

export class GameSetUp {
    p5: p5
    game: Game
    settings: settingType
    rows: rowsDataForResponseFromServerDataType[]
    rowsSchema: (rowSchemaType[])[]
    players: playersDataForResponseFromServerDataType[]
    variantsVisible: boolean
    images: { [key: string]: any }
    stage: gameStageType
    selectedCard: cardType | null
    playersMakeTurn: playerMakeTurnType[]
    pool: poolType
    checkedIndex: number
    playersIdSelectRow: string | null
    endGameResult: any
    fromSelection: boolean
    exitIcon: null | p5.Image
    constructor(p5: p5, game: Game, settings: settingType) {
        this.p5 = p5
        this.settings = settings
        this.game = game
        this.rows = this.game.gameData!.rows as rowsDataForResponseFromServerDataType[]
        this.players = this.game.gameData!.players as playersDataForResponseFromServerDataType[]
        this.variantsVisible = false
        this.images = { fullfiled: false }
        this.stage = "cardSelection"
        this.selectedCard = null
        this.playersMakeTurn = []
        this.pool = []
        this.checkedIndex = 0
        this.playersIdSelectRow = null
        this.endGameResult = null
        this.rowsSchema = []
        this.fromSelection = false
        this.exitIcon = null
    }
    setUpPool(pool: poolType) {
        this.pool = pool
        return
    }
    addToPlayersMakeTurn(player: playerMakeTurnType) {
        this.playersMakeTurn.push(player)
        return
    }
    clearPlayersMakeTurn() {
        this.playersMakeTurn = []
        return
    }
    setStage(stage: gameStageType) {
        this.stage = stage
        return
    }
    execute() {
        this.game.setRoot(new Root())
        if (!this.images.fullfiled) {
            // Экран загрузки и подгрузка картинок
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
            let okayImage = new Promise((res, _) => {
                this.images['okay'] = this.p5.loadImage('./source/dist/img/okay.png', () => {
                    res(null)
                })
            })
            let glassesImage = new Promise((res, _) => {
                this.images['glasses'] = this.p5.loadImage('./source/dist/img/glasses.png', () => {
                    res(null)
                })
            })
            let cardBack = new Promise((res, _) => {
                this.images['cardBack'] = this.p5.loadImage('./source/dist/img/cardBack.jpg', () => {
                    res(null)
                })
            })
           Promise.all([okayImage, glassesImage, cardBack]).then(() => {
                 this.game.root?.deleteElement('loading', 3)
                 this.images.fullfiled = true
                 this.execute()
           })
           return
        }
        let clickEventController = new EventController(EventsEnum.mouseClicked)
        this.game.root?.addEventController(clickEventController)
        // Создание фонового пласта
        let background = new P5Element(this.p5, { x: 0, y: 0, width: this.settings.width, height: this.settings.height, cornerType: "CORNER" })
        background.defineDrawFn(() => {
            drawNoOpacityBackground(this.p5, this.settings)
        })
        this.game.root?.addElement(background, 0)
        background.defineMouseCliced(() => {
            this.game.select.removeSelected()
        })
        clickEventController.addListener(background)
        if (this.players[0].hand.length === 0 && this.stage !== 'end') {
            this.game.webS?.send(JSON.stringify({
                type: messageFromClientTypes.getEndGameResults,
                token: localStorage.getItem("token")
            }))
            return
        }
        if (this.stage === "end") {
            let windowWidth = this.settings.width
            let windowHeigth = this.settings.height
            // Окно эндгейма
            let endGameWindow = new Block(windowWidth / 2, windowHeigth / 2, {
                width: Math.max(windowWidth / 2, 375), heigth: windowHeigth / 2, id: "endGame_menu", style: {
                    backgroundColor: 'rgba(227, 93, 93, 0.7)'
                }
            }, this.p5)
            this.game.root?.addElement(endGameWindow)
            let xEndGameWindow = windowWidth / 2 - Math.max(windowWidth / 2, 375) / 2
            let yEndGameWindow = windowHeigth / 2 - windowHeigth / 4
            // Данные о результатах
            let result = new P5Element(this.p5, {
                x: xEndGameWindow + 10,
                y: yEndGameWindow + 10
            })
            result.defineDrawFn((variables: generalCoordinatesType) => {
                let { x, y } = variables
                this.p5.push()
                this.p5.fill('black')
                let index = 1
                for (let key in this.endGameResult) {
                    this.p5.textAlign('left')
                    this.p5.text(`${this.endGameResult[key].name} - ${this.endGameResult[key].badPoints} очка; ${this.endGameResult[key].winner ? `Победитель` : ``}`,
                        x, y + (15 * index))
                    index++
                }
            })
            this.game.root?.addElement(result)
            // Кнопка выхода
            let exitButton = new P5Element<exitButtonVariablesType>(this.p5, exitButtonDataType)
            exitButton.defineDrawFn((variables: exitButtonVariablesType & generalCoordinatesType) => {
                drawExitButtonFn(this.p5, variables, this.exitIcon as p5.Image)
            })
            exitButton.defineMouseMoved(() => {
                exitButton.setVariable('backgroundColor', 'red')
            })
            exitButton.defineUnMovedFn((variables: exitButtonVariablesType) => {
                exitButton.setVariable('backgroundColor', 'rgb(255, 255, 255)')
            })
            exitButton.defineMouseCliced(() => {
                this.game.setState("menu")
                this.game.setUp()
            })
            this.game.root?.addElement(exitButton)
            return
        }
        // Создание раметок зон 
        let leftRowsArea = new P5Element(this.p5)
        let rigthHandAndPoolArea = new P5Element(this.p5)
        // Определение размеров зон
        let leftRowsAreaWidth = this.settings.width * 0.6 - 10
        let leftRowsAreaHeigth = this.settings.height - 10
        leftRowsArea.defineDrawFn(() => {
            drawLeftArea(this.p5, { leftRowsAreaWidth, leftRowsAreaHeigth })
        })
        let rigthHandAndPoolAreaWidth = this.settings.width * 0.4 - 5
        let rigthHandAndPoolAreaHeigth = this.settings.height - 10
        let rigthHandAndPoolAreaX = 10 + leftRowsAreaWidth + 5
        let rigthHandAndPoolAreaY = 10
        rigthHandAndPoolArea.defineDrawFn(() => {
            drawRightArea(this.p5, {
                rigthHandAndPoolAreaX,
                rigthHandAndPoolAreaY,
                rigthHandAndPoolAreaWidth,
                rigthHandAndPoolAreaHeigth
            })
        })
        this.game.root!
            .addElement(leftRowsArea)
            .addElement(rigthHandAndPoolArea)
        // Отрисовка полос с картами
        const countOfRows = 5
        let rowHeight = (leftRowsAreaHeigth / countOfRows) - 6
        let rowWidth = leftRowsAreaWidth - 12
        let cardHeight = rowHeight
        let cardWidth = rowWidth / 5 - 6
        let leftStart = 10
        let topStart = 10
        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            let y = topStart + 6 + cardHeight * rowIndex
            topStart += 6
            if (this.playersIdSelectRow === this.game.userInfo.id && this.stage === "rowSelection") {
                let blightning = new P5Element(this.p5, { x: leftStart, y, width: rowWidth, height: rowHeight, cornerType: "CORNER" })
                blightning.defineDrawFn(() => {
                    this.p5.push()
                    this.p5.rectMode('corner')
                    this.p5.stroke('rgb(183, 227, 9)')
                    this.p5.fill('rgba(183, 227, 9, 0.5)')
                    this.p5.strokeWeight(2)
                    this.p5.rect(leftStart, y, rowWidth, rowHeight, 10)
                    this.p5.pop()
                })
                blightning.defineMouseCliced(() => {
                    let dataForSendToSelectARow = {
                        rowIndex
                    }
                    let reportForServer = {
                        type: messageFromClientTypes.checkCardFromPoolWithReplace,
                        data: dataForSendToSelectARow,
                        token: localStorage.getItem("token")
                    }
                    this.game.webS?.send(JSON.stringify(reportForServer))
                })
                clickEventController.addListener(blightning)
                this.game.root?.addElement(blightning, 2)
            }
            for (let cardIndex = 0; cardIndex < 5; cardIndex++) {
                let card = new P5Element(this.p5)
                let x = leftStart + 6 + cardWidth * cardIndex
                leftStart += 6
                card.defineDrawFn(() => {
                    drawCardInRow(this.p5, {
                        rows: this.rows,
                        rowIndex,
                        cardIndex,
                        x,
                        y,
                        cardWidth,
                        cardHeight, 
                        glasses: this.images['glasses'],
                        backGround: this.images['cardBack']
                    })
                })
                if (!this.rowsSchema[rowIndex]) {
                    this.rowsSchema[rowIndex] = []
                }
                this.rowsSchema[rowIndex][cardIndex] = {
                    x, y
                }
                this.game.root?.addElement(card)
            }
            leftStart = 10
        }
        if (this.stage === "rowSelection") {
            let notification = new P5Element(this.p5, { x: 50, y: this.settings.height - 50 })
            let player = this.players.find(player => player.id === this.playersIdSelectRow)
            let cardFromPool = null
            for (let card of this.pool) {
                if (card.name === player?.name) {
                    cardFromPool = card.nominal
                }
            }
            notification.defineDrawFn((variables: generalCoordinatesType) => {
                this.p5.push()
                this.p5.textAlign("left")
                this.p5.stroke('black')
                this.p5.fill('black')
                this.p5.text(`${player?.name} решает куда отправить ${cardFromPool}`, variables.x, variables.y)
                this.p5.pop()
            })
            this.game.root?.addElement(notification)
        }
        // Создание отрисовки руки
        let currentPlayer = this.players.find(player => player.id === this.game.userInfo.id)
        let currentPlayersHand = currentPlayer!.hand
        let currentCardY = rigthHandAndPoolAreaY + 5
        let middleOfArea = rigthHandAndPoolAreaX + rigthHandAndPoolAreaWidth / 2
        for (let row = 0, col = -1, index = 0; index < currentPlayersHand.length; index++) {
            let r = row
            let c = col
            let card = new P5Element(this.p5, {
                cornerType: "CORNER", x: middleOfArea + (c * (cardWidth + 5)), y: currentCardY + ((cardHeight + 5) * r),
                width: cardWidth, height: cardHeight, col: c, selector: this.game.select
            })
            card.setSpaceSettings({ selectable: true, placer: false })
            card.defineDrawFn(() => {
                this.p5.push()
                this.p5.rectMode(this.p5.CORNER)
                this.p5.stroke('black')
                this.p5.strokeWeight(1)
                this.p5.fill('rgba(255, 255, 255, 0)')
                if (card.selected && this.stage === "cardSelection") {
                    this.p5.stroke('yellow')
                    this.p5.strokeWeight(4)
                }
                else if (this.stage === "awaiting" && this.selectedCard?.nominal === currentPlayersHand[index].nominal) {
                    this.p5.stroke('blue')
                    this.p5.strokeWeight(4)
                    this.p5.fill('rgba(255, 255, 255, 1)')
                }
                this.p5.rect(middleOfArea + (c * (cardWidth + 5)), currentCardY + ((cardHeight + 5) * r), cardWidth, cardHeight)
                this.p5.stroke('black')
                this.p5.strokeWeight(1)
                this.p5.text(`${currentPlayersHand[index].nominal}`, middleOfArea + (c * (cardWidth + 5)) + 15, currentCardY + ((cardHeight + 5) * r) + 20, 10)
                this.p5.pop()
            })
            // По апдейту карты удаляем дополнительное меню, если карта не выбрана
            this.game.root?.addElement(card)
            // необходимо прописать тип variables
            card.defineMouseCliced((variables: cardVariablesType) => {
                let selector: Select = variables.selector
                if (card.placer) {
                    return
                }
                if (card.selectable) {
                    selector.removeSelected()
                    if (this.stage === "cardSelection") {
                        selector.addSelected(card)
                        let selectedElement = selector.getSelectedObject()
                        // Отрисовка вариантов при выборе
                        let x, y
                        if (selectedElement.variables.col === -1) {
                            x = selectedElement.variables.x - cardWidth / 2
                            y = selectedElement.variables.y + cardHeight / 2
                        }
                        else {
                            x = selectedElement.variables.x + cardWidth * 1.5
                            y = selectedElement.variables.y + cardHeight / 2
                        }
                        let selectAccepter = new P5Element(this.p5, {
                            x, y, selector: this.game.select, width: this.p5.min(cardWidth / 2, 40) * 2,
                            height: this.p5.min(cardWidth / 2, 40) * 2
                        })
                        // Функция рисования выдвижного меню
                        selectAccepter.defineDrawFn((variables: cardVariablesType) => {
                            let selector = variables.selector
                            let x = variables.x
                            let y = variables.y
                            if (selector.isSelected()) {
                                this.p5.push()
                                this.p5.fill('green')
                                this.p5.noStroke()
                                let radius = this.p5.min(cardWidth / 2, 40)
                                let stepOutHalfRadius = this.p5.min(cardWidth / 2, 20)
                                if (selectedElement.variables.col === -1) {
                                    this.p5.circle(x, y, radius)
                                    this.p5.image(this.images.okay, x - stepOutHalfRadius, y - stepOutHalfRadius, radius,
                                        radius)
                                }
                                else {
                                    this.p5.circle(x, y, radius)
                                    this.p5.image(this.images.okay, x - stepOutHalfRadius, y - stepOutHalfRadius,
                                        radius, radius)
                                }
                                this.p5.pop()
                            }
                            else {

                            }
                        })
                        // Функция обновления выдвижного меню
                        selectAccepter.defineUpdateFn((variables: cardVariablesType) => {
                            let selector: Select = variables.selector
                            if (!selector.isSelected()) {
                                clickEventController.deleteListener(selectAccepter.getId())
                                this.game.root?.deleteElement(selectAccepter.getId())

                            }
                            else {
                                if (selector.getSelectedObject().getId() !== card.getId()) {
                                    clickEventController.deleteListener(selectAccepter.getId())
                                    this.game.root?.deleteElement(selectAccepter.getId())
                                }
                            }
                        })
                        selectAccepter.defineMouseCliced((variables: cardVariablesType) => {
                            this.setStage('awaiting')
                            this.setSelectedCard({ nominal: currentPlayersHand[index].nominal, badPoints: currentPlayersHand[index].badPoint })
                            let select: Select = variables.selector
                            select.removeSelected()
                            let dataForSend: playerMakesTurn = {
                                type: messageFromClientTypes.playerMakesTurn,
                                data: {
                                    player: this.game.userInfo.id as string,
                                    nOcard: this.selectedCard?.nominal as number
                                }
                            }
                            let objectForSend: fromClientToServerDataObjectType = {
                                ...dataForSend,
                                token: localStorage.getItem("token") as string
                            }
                            this.game.webS?.send(JSON.stringify(objectForSend))
                        })
                        clickEventController.addListener(selectAccepter)
                        this.game.root?.addElement(selectAccepter)
                        return
                    }
                }

            })
            clickEventController.addListener(card)
            col = 0
            if (index % 2 !== 0) {
                row++
                col = -1
            }
        }
        // Отрисовка в случае check
        let poolCardWidth = cardWidth
        let poolCardHeight = cardHeight
        let startX = 20
        let outStep = 10
        let startY = this.settings.height - poolCardHeight - 5
        if (this.stage === 'poolChecking') {
            for (let index = 0; index < this.pool.length; index++) {
                if (index >= this.checkedIndex) {
                    let x = startX + ((poolCardWidth + outStep) * index)
                    let y = startY
                    let card = new P5Element<Omit<extendedCardVariablesType, 'selector'>>(this.p5, {
                        x, y, width: poolCardWidth, height: poolCardHeight, checkedIndex: this.checkedIndex
                    })
                    card.setUniqueId(this.pool[index].id)
                    card.defineDrawFn((variables: Omit<extendedCardVariablesType, 'selector'>) => {
                        this.p5.push()
                        this.p5.rectMode("corner")
                        this.p5.strokeWeight(2)
                        this.p5.fill('green')
                        if (index === this.checkedIndex) {
                            this.p5.fill('red')
                        }
                        this.p5.rect(variables.x, variables.y, variables.width, variables.height, 10)
                        this.p5.fill('black')
                        this.p5.text(`${this.pool[index].nominal}`, variables.x + 20, variables.y + 25)
                        this.p5.text(`${this.pool[index].name}`, variables.x + 20, variables.y + variables.height - 5)
                        this.p5.pop()
                    })
                    this.game.root?.addElement(card)
                }
            }
            if (this.game.userInfo.id === this.players[0].id && this.fromSelection === false) {
                let checkPoolObject: checkCardFromPoolType & tokenDataType = {
                    type: messageFromClientTypes.checkCardFromPool,
                    data: null,
                    token: localStorage.getItem("token") as string
                }
                this.game.webS?.send(JSON.stringify(checkPoolObject))
            }
        }
    }
    setSelectedCard(card: cardType | null) {
        this.selectedCard = card
        return
    }
}