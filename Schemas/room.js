const mongoose = require('mongoose')

const Schema = mongoose.Schema


const MessageSchema = new Schema({
    Username: {
        type: String,
        required: true
    },
    Messagesend: {
        type: String
    },
    Time: {
        type: Date,
        default: Date.now
    },
    Send: {
        type: Boolean,
        // required: true,
        default: false
    }
})

module.exports=mongoose.model('lol',MessageSchema)



