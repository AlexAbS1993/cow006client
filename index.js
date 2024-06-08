import express from 'express'
import path from 'path'
import url from 'url'
import fs from 'fs'
import {htmlInnerFn} from './jsFiles.js'
import cors from 'cors'

const server = express()
const __filename = url.fileURLToPath(import.meta.url);
server.use(cors())
server.use("/source",express.static(path.dirname(__filename) + '/src'))
server.get('/', (req, res) => {
    let htmlInner = htmlInnerFn()
    fs.writeFileSync(path.dirname(__filename) + '/src/index.html', htmlInner, {flag: 'w'})
    res.sendFile(path.dirname(__filename) + '/src/index.html')
})
server.get('/secret', (req, res) => {
    let str = `{
        "hello": "secret"
    }`
    let js = JSON.parse(str)
    res.json(js)
})
server.listen(8080, () => {
    console.log('Port 8080 is active')
})        