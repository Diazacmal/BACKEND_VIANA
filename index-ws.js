const { Server } = require("socket.io");
const mqtt = require('mqtt')
const http = require('http');
const express = require('express')
const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

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
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000,
})

const topic = process.env.MQTT_TOPIC

//set index
app.get('/', (request, response) => {
    response.json({ info: 'Hello world' })
})

//listen from frontend
io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('ping', () => {
        //console.log(msg)
        io.emit('pong')
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});

client.on('connect', () => {
    console.log('Connected')
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
    })
    //client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    //    if (error) {
    //        console.error(error)
    //    }
    //})
})

//listen from mqtt server
client.on('message', (topic, payload) => {
    var str = payload.toString()
    var str2 = str.replace("b'{", "{")
    var str3 = str2.replace("}'", "}")

    console.log('Received Message:', str3)
    //emit payload mqtt to frontend (socketio)
    io.emit('payload', JSON.parse(str3))
})

server.listen(port, () => {
    console.log('listening on *:' + port);
})