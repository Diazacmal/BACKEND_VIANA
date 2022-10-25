const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const app = express()
const server = http.createServer(app)
const db = require('./components/queries')


//load config from env
dotenv.config();
port = process.env.PORT
//console.log(`Your port is `)

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(cors({
    origin: '*'
}))

app.get('/', (request, response) => {
    response.json({ info: 'Hello world' })
})

app.get('/rows', db.getRowsData)
app.get('/kendaraan', db.getDataKendaraan)

server.listen(port, () => {
    console.log('listening on *: ' + port);
})


