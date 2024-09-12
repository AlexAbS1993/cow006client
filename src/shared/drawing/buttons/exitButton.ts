import p5 from "p5"

export const exitButtonDataType = { x: 30, y: 30, backgroundColor: 'white', normRadius: 30, maxRadius: 40, width: 30, height:30 }

export function drawExitButtonFn(p5: p5, variables: typeof exitButtonDataType, exitIcon: p5.Image){
    p5.push()
    p5.fill(variables.backgroundColor)
    p5.circle(variables.x, variables.y, variables.normRadius)
    p5.imageMode(p5.CENTER)
    p5.image(exitIcon as p5.Image, variables.x, variables.y, 20, 20)
    p5.pop()
}