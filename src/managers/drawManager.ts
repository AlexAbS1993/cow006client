import { RoomDesktopStrategy } from "../entitieV2/Game/roomSetUp.DesktopStrategy";
import { IRoomSetUpDeviceStrategyDrawing } from "../entitieV2/Game/roomSetUp.types";
import { settingType } from "../entitieV2/Game/types";

export enum deviceEnum {
    desktop, mobile
}


export function defineDevice(settings: settingType):deviceEnum{
    if (settings.width >= 1360){
        return deviceEnum.desktop
    }
    else {
        return deviceEnum.mobile
    }
}

export class DrawManager {
    device: deviceEnum
    constructor(settings: settingType){
        this.device = DrawManager.defineDevice(settings)
    }
    getRoomSetUpDrawing(){
        switch (this.device) {
            case deviceEnum.desktop: {
                return RoomDesktopStrategy
            }
            case deviceEnum.mobile: {
                return RoomDesktopStrategy
            }
            default: {
                return RoomDesktopStrategy
            }
        }
    }
    static defineDevice(settings: settingType){
        return defineDevice(settings)
    }
}