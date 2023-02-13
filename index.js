const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const app = express()
const server = http.createServer(app)
const db = require('./components/queries.js')


//load config from env
dotenv.config();
port = process.env.PORT

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)




  



// GET,POST,PUT
app.use(cors())



app.get('/', (req, response) => {
    response.json({ info: "hello world" })
})

app.get('/rows', db.getRowsData)


app.get('/charts', db.getChartData)
app.get('/kendaraan', db.getDataKendaraan)
// endpoint cctv
app.post('/addCC',db.addcctv)
app.get('/data/:id',db.getidcctv)
app.put('/update/:id',db.updatecctv,(req,res)=>{
  res.write(data)
})
app.get('/cctv',db.getCCTV)


// data analitic

// endpoint skpj_analitic
app.get('/skpj',db.skpj)
app.post('/addskpj',db.add_skpj)
// endpoint fish_analitic
app.get('/fish',db.fish)
app.post('/addfish',db.add_fish)
// endpoint anomaly_analitic
app.get('/anomaly',db.anomaly)
app.post('/addanomaly',db.add_anomaly)
// endpoint social_distancing
app.get('/socialdistancing',db.socialdistancing_analytic)
app.post('/addsocial',db.add_socialdistancing)
// endpoint service
app.get('/service',db.service)
app.post('/addservice',db.addservice)




//app.get('/realtime', ws.getData)

server.listen(port, () => {
    console.log('listening on *: ' + port);
}) 


