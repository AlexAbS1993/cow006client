import { messageFromServerEnum } from "./messagesFromServer"

export type webSocketProcedureReportType<dataType = undefined> = {
    success: boolean,
    message: string,
    type: messageFromServerEnum,
    data?: dataType
}


export type handDataForResponsFromServerDataType = {
    nominal: number,
    badPoint: number
}

export type playersDataForResponseFromServerDataType = {
    id: string,
    name: string,
    hand: handDataForResponsFromServerDataType[],
    isLeader: boolean
}

export type rowsDataForResponseFromServerDataType = (handDataForResponsFromServerDataType|null)[]

export type gameStartedResponseFromServerDataType = {
    id: string,
    roomId: string,
    gamePartyId: string,
    players: playersDataForResponseFromServerDataType[],
    rows:rowsDataForResponseFromServerDataType[]
}
export type roomCreatedResponseFromServerDataType = {
    roomId: string
}

export type roomEnterResponseFromServerDataType = {
    players: Omit<playersDataForResponseFromServerDataType, "hand"|"isLeader">[]
    roomId: string,
    gamePartyId: string,
    newPlayer: Omit<playersDataForResponseFromServerDataType, "hand"|"isLeader">
}

export type playersMakeTurnDataTypeResonseFromServer = {
    playerTurn: string
}

export type cardFromPoolToRowPlacedSuccessfully = {
    playersId: string,
    rows: rowsDataForResponseFromServerDataType[],
    cardN: number
}
export type playersHandsType = {
    [key: string] : handDataForResponsFromServerDataType[]
}

export type switchToCheckMessageFromServerPoolDataType = (handDataForResponsFromServerDataType&{playerId: string})[]

export type playersIdFromServerDataType = {
    playersId: string
}

export type playersResultType = {
    name: string,
    id: string,
    badPoints: number,
    winner: boolean
}

export type resultEndGameType = {
    [key: string]: playersResultType
}