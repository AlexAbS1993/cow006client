/**
 * @file Интерфейс для создания классов, создающих отрисовку элементов в зависимости от размера экрана устройства.
 * @author Alex Abetov <abetovalex93@gmail.com>
 */

import p5 from "p5";
import { generalCoordinatesType, settingType } from "./types";
import { exitButtonDataType } from "../../shared/drawing/buttons/exitButton";
import { Root } from "../Root/model";

type drawGreetingsVariablesType = {
    roomId: string,
    text: string,
    userName: string
}

type drawPlayersListVariables = {
    orederNumber: number,
    isLeader: boolean,
    name: string
}

export interface IRoomSetUpDeviceStrategyDrawing {
    p5: p5
    root: Root
    updateRoot(root:Root):void
    /**
     * Рисует приветствие для игрока, который зашёл в комнату.
     *  
     * Отмечает номер комнаты, имя игрока и выводит приветственный текст
     * @param settings значения ширины экрана и его высоты
     * @param variables необходимые значения для описания комнаты
     */
    drawGreetings(settings: settingType, variables: drawGreetingsVariablesType):void
    /**
     * @param settings значения x и y
     * @param variables Содержит в себе информацию по игроку:
     * - порядковый номер; 
     * - имя;
     * - является ли он лидером комнаты;
     */
    drawPlayersList(settings: generalCoordinatesType, variables: drawPlayersListVariables):void
    /**
     * 
     * @param variables 
     */
    drawExitButton(variables: typeof exitButtonDataType, icon?:p5.Image):void
}