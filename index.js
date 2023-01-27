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

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)


app.use(cors({
    origin: '*'
}))



app.get('/', (req, response) => {
    response.json({ info: "hello world" })
})

app.get('/rows', db.getRowsData)


app.get('/charts', db.getChartData)
app.get('/kendaraan', db.getDataKendaraan)
app.get('/cctv',db.getCCTV)

//app.get('/realtime', ws.getData)

server.listen(port, () => {
    console.log('listening on *: ' + port);
}) 


