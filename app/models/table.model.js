const mongoose = require('mongoose')


const TableSchema = mongoose.Schema({
    title: String,
    seats: Number,
    deck: [{
        suit: String,
        rank: String    
    }],
    shitTalkMessages: [
        {
            username: String,
            message: String
        }
    ],
    users: [
        {
            email: String,
            username: String,
            password: String,
            isFake: {type: Boolean, default: false},
            hand: [{rank: String, suit: String}],
            _id: String
        }
    ]
}, {
    timestamps: true
})

const Table = mongoose.model('Table', TableSchema)

module.exports = {
    Table
}