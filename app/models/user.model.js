const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    associatedTables: [String]
})

module.exports = mongoose.model('User', UserSchema)