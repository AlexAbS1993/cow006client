import p5 from "p5"
import { Block } from "../Block/model.js"
import { backgroundImageVariablesType, generalCoordinatesType, settingType } from "./types"
import { Game } from "./model"
import { Root } from "../Root/model.js"
import { fromClientToServerDataObjectType, messageFromClientTypes } from "../../const/messagesFromClient"
import { P5Element } from "../Element/model"
import { EventsEnum } from "./Events/events.type"
import { EventController } from "../../entities/Events/eventController.js"

export class MenuSetUp {
    p5: p5
    settings: settingType
    game: Game
    constructor(p5: p5, game: Game, settings: settingType) {
        this.p5 = p5
        this.settings = settings     
        this.game = game
    }
    getRoot(): Root {
        return this.game.root as Root
    }
    execute() {
        this.game.root?.clearEventControllers()
        // Размеры окон
        let windowHeigth = this.settings.height
        let windowWidth = this.settings.width
        // Создание фона
        let backgroundImage = this.p5.loadImage('./source/dist/img/back2.jpg')
        let backGround = new P5Element<backgroundImageVariablesType>(this.p5, {x: -300, y: -300, direction: 'r'})
        .setVelLimit(0.4)
        .defineDrawFn((variables: backgroundImageVariablesType&generalCoordinatesType) => {
            this.p5.push()
            this.p5.image(backgroundImage, variables.x, variables.y, this.settings.width+600, this.settings.height+500)
            this.p5.pop()
          })
        .defineUpdateFn((constants: backgroundImageVariablesType&generalCoordinatesType) => {
            if (constants.direction === 'r'){
                let force = this.p5.createVector(0.4, 0)
                backGround.applyForce(force)
            }
            else {
                let force = this.p5.createVector(-0.4, 0)
                backGround.applyForce(force)
            }
            if (backGround.position.x <= -300){
                backGround.variables.direction = 'r'
            }
            if(backGround.position.x >= 0){
                backGround.variables.direction = 'l'
            }
        })
        backGround.setUniqueId('background')
        this.game.root?.addElement(backGround, 0)
        // Добавление квадрата меню
        let menu = new Block(windowWidth / 2, windowHeigth / 2, { width: Math.max(windowWidth / 3, 375), heigth: windowHeigth / 2 }, this.p5)
        this.getRoot().addElement(menu, 0)
        let menusX = windowWidth / 2 - (Math.max(windowWidth / 3, 375) / 2)
        let menusY = windowHeigth / 2 - ((windowHeigth / 2) / 2)
        let widthOfInput = Math.max((windowWidth / 3)  - 40, 335)
        let heigthOfInput = 40
        // Создание строчек меню
        // Если залогинен
        if (this.game.userInfo.logined) {
            this.p5.push()
            let enterTheRoomInput = this.p5.createInput()
            this.game.elements.push(enterTheRoomInput)
            enterTheRoomInput.addClass("loginInput")
            enterTheRoomInput.attribute("placeholder", "ID комнаты")
            enterTheRoomInput.attribute("id", "enterTheRoomInputId")
            enterTheRoomInput.position(menusX + 20, menusY + 20)
            enterTheRoomInput.size(widthOfInput / 2 - 5, heigthOfInput)
            let greetings = new P5Element(this.p5).defineDrawFn(() => {
                this.p5.push()
                this.p5.textAlign(this.p5.CENTER)
                this.p5.textSize(22)
                this.p5.text(`Добро пожаловать в меню ${this.game.userInfo.login}`, this.settings.width/2, this.settings.height/5)
                this.p5.pop()
            })
            this.getRoot().addElement(greetings, 1)
            let enterTheRoomButton = this.p5.createButton("Войти в комнату")
            this.game.elements.push(enterTheRoomButton)
            enterTheRoomButton.addClass("menuButtonLogined")
            enterTheRoomButton.position(menusX + 20 + widthOfInput / 2 + 5, menusY + 20)
            enterTheRoomButton.size(widthOfInput / 2 - 5, heigthOfInput)
            // Обработка клика по входу в комнату ---------------------------------- //
            enterTheRoomButton.mouseClicked(() => { 
                let requestObject: fromClientToServerDataObjectType = {
                    type: messageFromClientTypes.enterTheRoom,
                    token: localStorage.getItem("token") as string,
                    data: {
                        roomToEnter: String(enterTheRoomInput.value())
                    }
                }
                this.game.webS!.send(JSON.stringify(requestObject))
                this.game.elements.forEach(htmlElement => {
                    htmlElement.elt.disabled = true
                })
                this.game.setBlockedUI(true)
                return
            })
            let createRoomButton = this.p5.createButton("Создать комнату")
            this.game.elements.push(createRoomButton)
            createRoomButton.addClass("menuButtonLogined")
            createRoomButton.position(menusX + 20, menusY + 80)
            createRoomButton.size(widthOfInput, heigthOfInput)
            // Обработка клика по созданию комнаты ---------------------------------- //
            createRoomButton.mouseClicked(() => {
                let requestObject:fromClientToServerDataObjectType = {
                    type: messageFromClientTypes.doRoomCreate,
                    token: localStorage.getItem("token") as string,
                    data: null
                }
                this.game.webS?.send(JSON.stringify(requestObject))
                return
            })
           
            this.game.elements.forEach((element, index) => {
                element.elt.style = `${element.elt.style.cssText}; --animationDelay: ${index * 0.05}s;`
                element.addClass("inAnimated")
            })
            setTimeout(() => {
                this.game.elements.forEach((element, index) => {
                    element.removeClass("inAnimated")
                })
            }, 1000)
            this.p5.pop()
        }
        // Если не залогинен
        else {
            this.p5.push()
            let loginInput = this.p5.createInput()
            loginInput.addClass("loginInput")
            loginInput.attribute("placeholder", "login")
            loginInput.position(menusX + 20, menusY + 20)
            loginInput.size(widthOfInput, heigthOfInput)
            let passwordInput = this.p5.createInput()
            passwordInput.addClass("loginInput")
            passwordInput.attribute("placeholder", "password")
            passwordInput.position(menusX + 20, menusY + 80)
            passwordInput.size(widthOfInput, heigthOfInput)
            let widthOfButton = (widthOfInput / 2) - 5
            let heightOfButton = heigthOfInput
            let registrateButton = this.p5.createButton("Регистрация")
            registrateButton.addClass("logInButton")
            registrateButton.position(menusX + 20, menusY + 130)
            registrateButton.size(widthOfButton, heightOfButton)
            let logInButton = this.p5.createButton("Войти")
            logInButton.addClass("logInButton")
            logInButton.position(menusX + 20 + widthOfButton + 10, menusY + 130)
            logInButton.size(widthOfButton, heightOfButton)
            this.game.elements.push(loginInput)
            this.game.elements.push(logInButton)
            this.game.elements.push(passwordInput)
            this.game.elements.push(registrateButton)
            registrateButton.mouseClicked(() => {
                let loginValue = String(loginInput.value())
                let passwordValue = String(passwordInput.value())
                this.game.elements.forEach(element => {
                    element.elt.disabled = true
                })
                let requestObject: fromClientToServerDataObjectType = {
                    "type": messageFromClientTypes.registrate,
                    "data": {
                        "login": loginValue,
                        "password": passwordValue
                    }
                }
                this.game.webS?.send(JSON.stringify(requestObject))
                this.game.elements.forEach(element => {
                    element.elt.disabled = false
                })
            })
            logInButton.mouseClicked(async () => {
                let loginValue = String(loginInput.value())
                let passwordValue = String(passwordInput.value())
                let requestObject:fromClientToServerDataObjectType = {
                    "type": messageFromClientTypes.loginIn,
                    "data": {
                        "login": loginValue,
                        "password": passwordValue
                    }
                }
                this.game.webS!.send(JSON.stringify(requestObject))
            })

            let fakeButtonLogIn = this.p5.createButton("ВОЙТИ БЕЗ РЕГИСТРАЦИИ ФЕЙК")
            fakeButtonLogIn.position(menusX + 20, menusY + 200)
            fakeButtonLogIn.size(widthOfInput, heigthOfInput)
            fakeButtonLogIn.mouseClicked(() => {
                this.game.elements.forEach((element, index) => {
                    element.elt.disabled = true
                    element.addClass("outAnimated")
                })
                setTimeout(() => {
                    this.game.setLogined()
                    this.game.setLogin("AlexDev")
                    this.game.setId("19930405")
                    for (let element of this.game.elements) {
                        element.elt.parentNode.removeChild(element.elt)
                    }
                    this.game.elements = []
                    this.execute()
                }, 1000)
            })
            this.game.elements.push(fakeButtonLogIn)
            this.game.elements.forEach((element, index) => {
                element.elt.style = `${element.elt.style.cssText}; --animationDelay: ${index * 0.05}s;`
                element.addClass("inAnimated")
            })
            setTimeout(() => {
                this.game.elements.forEach((element, index) => {
                    element.removeClass("inAnimated")
                })
            }, 1000)
            this.p5.pop()
        }
    }
    clearElements(){
        for (let element of this.game.elements) {
            element.elt.parentNode.removeChild(element.elt)
        }
        this.game.elements = []
    }
}