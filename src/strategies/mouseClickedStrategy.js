class selectedStrategy{
    constructor(selectController){
        this.selectController = selectController
        this.name = 'selectedStrategy'
    }
    execute(element){
        let selectedObject = this.selectController.getSelectedObject()
        if(element.amISelectable()){
            this.selectController.addSelected(element)
            return true
          }
          if (element.amIPlacer()){
               selectedObject.movementPoint = element
            return true
          }
          if (!element.amIPlacer() && !element.amISelectable()){
            this.selectController.removeSelected()
            return true
          }
        return false
    }
    getName(){
      return this.name
    }
}

class unselectedStrategy{
    constructor(selectController){
        this.selectController = selectController
        this.name = 'unselectedStrategy'
    }
    execute(element){
        if (element.amISelectable()){
            this.selectController.addSelected(element)
            element.setSelected(true)
            return  true
          }
        return false
    }
    getName(){
      return this.name
    }
}