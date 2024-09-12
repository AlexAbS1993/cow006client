export interface IVariables {
    getAll():{[key: string]: any}
    addVariable<TYPE>(key: string, variable: TYPE):IVariables
    updateVariable<TYPE>(key: string, variable:TYPE):void
    getVariable<TYPE>(key: string):TYPE
}