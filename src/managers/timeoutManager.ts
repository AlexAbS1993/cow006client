type timeoutStackType = {
    fn: Function
    timeDelay: number,
    id: string
}

export class TimeOutManager {
    stack: timeoutStackType[]
    started: boolean
    constructor(){
        this.stack = []
        this.started = false
    }
    private idGen(){
        return Math.round(Math.random() * 10000)
    }
    addToStack(fn: Function, delay: number){
        this.stack.push({fn, timeDelay: delay, id: String(this.idGen())})
    }
    go(){
        if (this.stack.length !== 0 && this.started !== true){
            this.started = true
            let result = new Promise((res, rej) => {
                setTimeout(() => {
                    this.stack[0].fn()
                    res(null)
                }, this.stack[0].timeDelay*1000)
            })
            result.then(_ => {
                this.stack.shift()
                this.started = false
            })
        }
    }
}