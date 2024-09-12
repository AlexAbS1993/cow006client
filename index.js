import express from 'express'
import path from 'path'
import url from 'url'
import cors from 'cors'
import env from 'dotenv'

env.config({path: `.${process.env.NODE_ENV}.env`})

let distName = process.env.MODE === "development" ? "/dev" : "/pub"

const server = express()
const __filename = url.fileURLToPath(import.meta.url);
server.use(cors())
server.use("/source",express.static(path.dirname(__filename) + distName))
server.get('/', (req, res) => {
    res.sendFile(path.dirname(__filename) + '/index.html')
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