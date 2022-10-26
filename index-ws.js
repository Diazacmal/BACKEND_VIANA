const { Server } = require("socket.io");
const mqtt = require('mqtt')
const http = require('http');
const express = require('express')
const app = express()
const server = http.createServer(app);
const io = new Server(server);
const dotenv = require('dotenv')

dotenv.config();
const host = process.env.MQTT_HOST
const port = process.env.MQTT_PORT  
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client =   mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
})

const topic = process.env.MQTT_TOPIC

//prototype chat app
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
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
    console.log('Received Message:', topic, payload.toString())

    //listen connection from socketio client
    io.on('connection', (socket) => {
        console.log(topic, payload.toString())
    })
    
        //emit payload (socketio)
        
    })

    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('chat message', (msg) => {
        console.log('message from client: ' + msg);
        io.emit('chat message', msg);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    io.emit('chat message', message.toString());  
  })    

server.listen(port, () => { 
    console.log('listening on *:' + port);
})