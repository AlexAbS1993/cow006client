export enum messageFromClientTypes {
    "doRoomCreate" = "doRoomCreate",
    "enterTheRoom" = "enterTheRoom",
    "exitTheRoom" = "exitTheRoom",
    "setName" = "setName",
    "loginIn" = "loginIn",
    "registrate" = "registrate",
    "startTheGame" = "startTheGame",
    "playerMakesTurn" = "playerMakesTurn",
    "checkCardFromPool" = "checkCardFromPool",
    "checkCardFromPoolWithReplace" = "checkCardFromPoolWithReplace",
    "needToTakeHands" = "needToTakeHands",
    "getEndGameResults" = "getEndGameResult",
    "iAmInAlready" = "iAmInAlready"
}

export type tokenDataType = {
    token?: string
}

export enum GameMods {
    "classic" = "classic",
    "tactic" = "tactic"
}

export type fromClientToServerDataObjectType = (createRoomMessageType | enterTheRoomMessageType | exitRoomMessageType | setNameMessageType | loginInDataType |
    registrateDataType | theGameStartType | playerMakesTurn | checkCardFromPoolType | checkCardFromPoolWithReplaceType | needToTakeHandsMessageDataType |
    endGameMessageDataType
) & tokenDataType

export type createRoomMessageType = {
    type: messageFromClientTypes.doRoomCreate
    data: null
}
export type enterTheRoomMessageType = {
    type: messageFromClientTypes.enterTheRoom,
    data: enterTheRoomDataType
}

export type exitRoomMessageType = {
    type: messageFromClientTypes.exitTheRoom,
    data: exitFromRoom
}

export type setNameMessageType = {
    type: messageFromClientTypes.setName,
    data: {
        name: string
    }
}
export type loginInDataType = {
    type: messageFromClientTypes.loginIn,
    data: {
        login: string,
        password: string,
    }
}
export type registrateDataType = {
    type: messageFromClientTypes.registrate,
    data: {
        login: string,
        password: string
    }
}

export type theGameStartType = {
    type: messageFromClientTypes.startTheGame,
    data: {
        mode: GameMods
    }
}

export type playerMakesTurn  = {
    type: messageFromClientTypes.playerMakesTurn,
    data: {
        player: string,
        nOcard: number
    }
}

export type checkCardFromPoolType = {
    type: messageFromClientTypes.checkCardFromPool,
    data: null
}

export type checkCardFromPoolWithReplaceType = {
    type: messageFromClientTypes.checkCardFromPoolWithReplace,
    data: {
        rowIndex: number
    }
}

export type needToTakeHandsMessageDataType = {
    type: messageFromClientTypes.needToTakeHands
}

export type endGameMessageDataType = {
    type: messageFromClientTypes.getEndGameResults
}

// Data-объекты в мессенджах от клиента по разным типам
export type createRoomDataType = {}
export type enterTheRoomDataType = {
    roomToEnter: string
}
export type exitFromRoom = {
    roomFrom: string
}
