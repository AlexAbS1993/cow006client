class Select{
    constructor(){
      this.selectedObject = null
      this.eventName = 'select'
    }
    addSelected(obj){
      this.selectedObject = obj
      return this
    }
    removeSelected(){
      if (this.isSelected()){
        this.selectedObject.setSelected(false)
        this.selectedObject = null
        return
      }   
      return
    }
    isSelected(){
      return Boolean(this.selectedObject)
    }
    getSelectedObject(){
     return this.selectedObject
    }
  }