const jsFiles = [
    './source/lib/p5/p5.min.js',
    './source/entities/block.js',
    './source/entities/movement.js',
    './source/entities/select.js',
    './source/entities/Effects/effect.js',
    './source/root.js',
    './source/entities/Events/eventController.js',
    './source/strategies/mouseClickedStrategy.js'
]


export function htmlInnerFn(){
    let resultString = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="./source/styles.css" />
        ${
            jsFiles.map(path => `<script src=${path}></script>`).join('\r\n')
        }
        <script src="./source/sketch.js"></script>
        <title>Document</title>
    </head>
    <body>  
    </body>
    </html>`
    return resultString
}