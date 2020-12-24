// import mongoose from 'mongoose'
const mongoose = require('mongoose')

const Schema = mongoose.Schema


module.exports =
    function dynamicModel(suffix) {
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
        return mongoose.model('Room:' + suffix, MessageSchema);
    }

// export default mongoose.model('messagemodel',MessageSchema)
// module.exports=mongoose.model('messagemodel',MessageSchema)
