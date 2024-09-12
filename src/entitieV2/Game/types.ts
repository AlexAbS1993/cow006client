import { Select } from "../../entities/select"

export type settingType = {
    width: number,
    height: number
}


export type informationType = {
    logined: boolean,
    login: string | null,
    name: string | null,
    id: string | null
}

export type cardType = {
    nominal: number,
    badPoints: number
}

export type handType = cardType[]
export type players = Omit<informationType, "login"|"logined"> & {
    hand: handType
}

export type expectedParsedDataType = {
    type: string,
    data: any,
    message: string,
    success: boolean
}

// InGameTypes
export type gameStageType = "cardSelection"|"poolChecking"|"rowSelection"|"end"|'awaiting'
export type playerMakeTurnType = {
    name: string,
    id: string
}

export type poolType = (playerMakeTurnType&cardType)[]

//coordinates

export type generalCoordinatesType = {
    x: number, y: number
}
export type generalSizesType = {
    width: number, height: number
}

// variables

export type backgroundImageVariablesType = {
  direction: 'r'|'l'
}

export type exitButtonVariablesType = {
    backgroundColor: string,
    normRadius: number,
    maxRadius: number,
    width: number,
    height: number
}

export type cardVariablesType = {
    x: number
    y: number
    selector: Select
}

export type extendedCardVariablesType = Omit<cardVariablesType, 'selector'> & {
    height: number, width: number, checkedIndex: number
}