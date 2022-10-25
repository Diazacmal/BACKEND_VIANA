const mqtt = require('mqtt')
const dotenv = require('dotenv')

dotenv.config();
const host = process.env.MQTT_HOST
const port = process.env.MQTT_PORT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
})

//const topic = '/nodejs/mqtt'
const topic = process.env.MQTT_TOPIC

const getData = (request, response) => {
    client.on('connect', () => {
        console.log('Connected')
        client.subscribe([topic], () => {
            console.log(`Subscribe to topic '${topic}'`)
        })

        response.status(200).json(`Subscribe to topic '${topic}`)
    })

    //listen from mqtt server
    client.on('message', (topic, payload) => {
        console.log('Received Message:', topic, payload.toString())

        //listen connection from socketio client
        io.on('connection', (socket) => {
            console.log('a user connected')
            console.log(topic, payload.toString())

            //emit payload (socketio)
        })
    })
}

module.exports = {
    getData
  }