const TableModel = require('../models/table.model.js')

const Table = TableModel.Table
const UserInTable = TableModel.UserInTable

// create and save new table
const create = (req, res) => {
    
    // validate
    if ( !req.body.deck ) {
        return res.status(400).send({
            message: "table deck can't be empty"
        })
    }

    if ( req.body.users.length == 0 ) {
        return res.status(400).send({
            message: "need starting users"
        })
    }

    if ( !req.body.title ) {
        return res.status(400).send({
            message: "table title can't be empty"
        })
    }

    if ( !req.body.seats ) {
        return res.status(400).send({
            message: "table needs seat, homie"
        })
    }

    let totalUsers = req.body.users

    for (let i = 0; i < req.body.seats - 1; i++) {
        const emptySeatUser = {
            email: "emptySeat@fillme.com",
            password: "",
            username: "emptySeat",
            isFake: true
        }
        totalUsers.push(emptySeatUser)
    }

    // create a table
    const table = new Table({
        title: req.body.title || "you aint name this table",
        deck: req.body.deck,
        seats: req.body.seats,
        users: totalUsers
    })

    table.save()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: "some shit went down saving the table: " + err.message 
            })
        })
}

// grab and return all tables
const findAll = (req, res) => {
    Table.find()
        .then(tables => {
            res.send(tables)
        })
        .catch(err => {
            res.status(500).send({
                message: "some shit went down grabbing all tables: " + err.message
            })
        })
}

// grab a single table with tableId
const findOne = (req, res) => {
    Table.findById(req.params.tableId)
        .then(table => {
            if ( !table ) {
                return res.status(404).send({
                    message: "couldnt find table with id: " + req.params.tableId
                })
            }
            res.send(table)
        })
        .catch(err => {
            if( err.kind == 'ObjectId' ) {
                return res.status(404).send({
                    message: "couldnt find table with id: " + req.params.tableId
                })
            }

            return res.status(500).send({
                message: "fucked up retrieving table with id: " + req.params.tableId
            })
        })
}

// update a table based on the tableId
const updateTableDeck = (req, res) => {
    if ( !req.body.deck ) {
        return res.status(400).send({
            message: "table deck cannot be empty"
        })
    }

    Table.findByIdAndUpdate(req.params.tableId, {
        deck: req.body.deck,
        users: req.body.users
    }, {
        new: true
    })
    .then(table => {
        if ( !table ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }
        res.send(table)
    })
    .catch(err => {
        if( err.kind == 'ObjectId' ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }

        return res.status(500).send({
            message: "fucked up updating table with id: " + req.params.tableId + ": "
        })
    })  
}

const resetTableDeck = (req, res) => {
    if ( !req.body.deck ) {
        return res.status(400).send({
            message: "table deck cannot be empty"
        })
    }

    Table.findByIdAndUpdate(req.params.tableId, {
        deck: req.body.deck,
        users: req.body.users
    }, {
        new: true
    })
    .then(table => {
        if ( !table ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }
        res.send(table)
    })
    .catch(err => {
        if( err.kind == 'ObjectId' ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }

        return res.status(500).send({
            message: "fucked up updating table with id: " + req.params.tableId + ": "
        })
    }) 
}

// update a table based on the tableId
const updateTableUsers = (req, res) => {
    if ( !req.body.users ) {
        return res.status(400).send({
            message: "table users cannot be empty"
        })
    }

    Table.findByIdAndUpdate(req.params.tableId, {
        users: req.body.users
    }, {
        new: true
    })
    .then(table => {
        if ( !table ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }
        res.send(table)
    })
    .catch(err => {
        if( err.kind == 'ObjectId' ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }

        return res.status(500).send({
            message: "fucked up updating table with id: " + req.params.tableId + ": "
        })
    })  
}

const deleteTableChat = (req, res) => {
    Table.findByIdAndUpdate(req.params.tableId, {
        shitTalkMessages: []
    }, {
        new: true
    })
    .then(table => {
        if ( !table ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }
        res.send(table)
    })
    .catch(err => {
        if( err.kind == 'ObjectId' ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }

        return res.status(500).send({
            message: "fucked up updating table with id: " + req.params.tableId + ": "
        })
    })
}

// delete table based on tableId
const deleteTable = (req, res) => {
    Table.findByIdAndDelete(req.params.tableId)
        .then(table => {
            if(!table) {
                return res.status(404).send({
                    message: "couldnt find table with id: " + req.params.tableId
                })
            }

            res.send({ message: "nice, got rid of that table" })
        })
        .catch(err => {
            if ( err.kind == 'ObjectId' || err.name == "NotFound" ) {
                return res.status(404).send({
                    message: "couldnt find table with id: " + req.params.tableId
                })
            }

            return res.status(500).send({
                message: "fucked up deleting table with id: " + req.params.tableId
            })
        })
}

// update table chat when user submits chat message
const updateTableChat = (req, res) => {
    if ( !req.body.shitTalkMessages ) {
        return res.status(400).send({
            message: "table messages cannot be empty"
        })
    }

    Table.findByIdAndUpdate(req.params.tableId, {
        shitTalkMessages: req.body.shitTalkMessages
    }, {
        new: true
    })
    .then(table => {
        if ( !table ) {
            return res.status(404).send({
                message: "couldn't find table with id: " + req.params.tableId
            })
        }
        res.send(table)
    })
    .catch(err => {
        if( err.kind == 'ObjectId' ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }

        return res.status(500).send({
            message: "fucked up updating table with id: " + req.params.tableId + ": "
        })
    })
}

const shuffleAndDeal = (req, res) => {

    Table.findByIdAndUpdate(req.params.tableId, {
        deck: req.body.deck,
        users: req.body.users
    }, {
        new: true
    })
    .then(table => {
        if ( !table ) {
            return res.status(404).send({
                message: "couldn't find table with id: " + req.params.tableId
            })
        }
        
        res.send(table)
    })
    .catch(err => {
        if( err.kind == 'ObjectId' ) {
            return res.status(404).send({
                message: "couldnt find table with id: " + req.params.tableId
            })
        }

        return res.status(500).send({
            message: "fucked up updating table with id: " + req.params.tableId + ": "
        })
    })
}


module.exports = {
    create,
    deleteTable,
    updateTableDeck,
    updateTableUsers,
    findOne,
    findAll,
    updateTableChat,
    deleteTableChat,
    shuffleAndDeal,
    resetTableDeck
}