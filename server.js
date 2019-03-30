const bodyParser = require('body-parser')
const express = require('express')
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose')
const cors = require('cors')
const io = require('socket.io')()
const _ = require('underscore')
const winston = require('winston')
const expressWinston = require('express-winston')

require('winston-loggly-bulk')

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("connected to db")
}).catch(err => {
    console.log("couldnt connect to db", err)
    process.exit()
})

const app = express()
const port = 1234
const socketPort = 2345

app.use(cors())

// winston logging to loggly
// dont need for developement but good to have

// app.use(expressWinston.logger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true
//         }),
//         new winston.transports.Loggly({
//             subdomain: 'tommeredith.loggly.com',
//             inputToken: 'aa3352c9-96ae-42da-8eb4-5be6d3354d16',
//             json: true,
//             tags: ["NodeJS-Express"]
//         })
//     ]
// }));

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.json({"message": "all kinds of shit happening up in here"})
})

// bring in table routes
require('./app/routes/table.routes.js')(app);

// bring in user routes
require('./app/routes/user.routes.js')(app)

var players = {}

io.on('connection', client => {

    // JUST FOR KEEPING TRACK OF CURRENT SESSIONS
    players[client.id] = true
    io.sockets.emit('connected_players', _.size(players));
    console.log('PLAYERS: ', players)

    client.on('disconnect', () => {
        delete players[client.id]
        console.log('player ' + client.id + ' disconnected')
    })


    // CHAT MESSAGES
    
    client.on('talk_shit', (message) => {
        console.log('message: ', message)

        io.sockets.emit('shit_talked', message)
    })

    // DEAL CARDS

    client.on('deal_hand', (users, deck) => {
        console.log('dealt users: ', users)

        io.sockets.emit('hand_dealt', users, deck)
    })

    // RESET DECK

    client.on('reset_deck', (users, deck) => {
        console.log('deck reset')

        io.sockets.emit('deck_reset_emission', users, deck)
    })

    // client.on('subscribeToTimer', interval => {
    //     console.log('client is subscribing to timer with interval ', interval)

    //     setInterval(() => {
    //         client.emit('timer', new Date())
    //     }, interval)
    // })
})

io.listen(socketPort)
console.log('socket listening on ' + socketPort)

app.listen(port, () => {
    console.log("i'm hearing you on " + port)
})