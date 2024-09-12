import { P5Element } from "../entitieV2/Element/model"
import { Root } from "../entitieV2/Root/model"

export function tipShowAction(root: Root, tip: P5Element<any>) {
    root?.addElement(tip, 2)
    setTimeout(() => {
        root?.deleteElement(tip.getId(), tip.getCurrentLayer())
    }, 2000)
    return
}
