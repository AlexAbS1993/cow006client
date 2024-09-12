import { IVariables } from "./interface";

export class Variables implements IVariables {
    private vars: {[key: string]: any}
    constructor(){
        this.vars = {}
    }
    getAll(): { [key: string]: any; } {
        return this.vars
    }
    addVariable<TYPE>(key: string, variable: TYPE): IVariables {
        this.vars[key] = variable
        return this
    }
    updateVariable<TYPE>(key: string, variable: TYPE): void {
        this.vars[key] = variable
        return
    }
    getVariable<TYPE>(key: string): TYPE {
        return this.vars[key]
    }
    
}