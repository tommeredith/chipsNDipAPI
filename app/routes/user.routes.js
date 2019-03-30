module.exports = app => {
    const users = require('../controllers/user.controllers.js')

    // creates a new user
    app.post('/users', users.create)

    // get all users
    app.get('/users', users.findAll)

    // get a single user with userId
    app.get('/users/:userId', users.findOne)

    // update a user with userId
    app.put('/users/:userId', users.update)

    // update a user deck with userId
    app.put('/users/:userId/hand', users.updateHand)

    app.post('/users/login', users.login)
    
    // delete a user with userId
    app.delete('/users/:userId', users.deleteUser)

    // update user associatedTables
    app.put('/users/:userId/updateAssociatedTable', users.updateAssociatedTable)
}