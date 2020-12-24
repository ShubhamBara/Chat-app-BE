// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }

// import express from 'express'
const express = require('express')
const mongoose = require('mongoose')
const Createmodel = require('./Schemas/whatsappRoom')
const Pusher = require("pusher");
const path = require('path')

const lol = require('./Schemas/room')

// const CreateModel =require('./Schemas/room')

const pusher = new Pusher({
    appId: "1113047",
    key: "a08fd4d49733f774e87e",
    secret: "1ed208ba7ee4343a0106",
    cluster: "ap2",
    useTLS: true
});


const port = process.env.PORT || 5000

const mongodburi =
    'mongodb+srv://shubham:TO3fpjJRLfMYuKyS@cluster0.r0ctr.mongodb.net/whatsappdb?retryWrites=true&w=majority'
// 'mongodb://localhost:27017/whatsappdb'

// Connect to the MongoDB cluster
mongoose.connect(
    mongodburi,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;

db.once('open', () => {
    console.log("DB connected")

    const msgCollection = mongoose.connection.db
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log(change)

        if (change.operationType == 'insert') {
            const messageDetail = change.fullDocument;
            pusher.trigger('message', 'inserted',
                {
                    _id: messageDetail._id,
                    Send: messageDetail.Send,
                    Username: messageDetail.Username,
                    Messagesend: messageDetail.Messagesend,
                    Time: messageDetail.Time,
                }
            );
        } else {
            console.log('Error Triggering Pusher')
        }
    })
})


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//to handle CORS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Headers', "*")
    next();
})

app.get('/', (req, res) => {
    res.send('fuck you bitch')
})



//sidebar display
app.get('/room/display', async (req, res) => {
    // console.log(req.body)
    // try {
    //     const all_message=await messagemodel.find()
    //     res.send(all_message)

    // } catch (error) {
    //     console.error(error)
    // }
    mongoose.connection.db.listCollections().toArray((err, names) => {
        if (err) {
            console.error(err)
        } else {
            const itemname = names.map((item) => {
                return item
                // console.log(item.name)
            })
            console.log(itemname)
            res.send(itemname)
            // console.log(names)
        }

    })

    // res.redirect('/')


})

app.get('/room/display/:room_name', async (req, res) => {
    const rooM = await mongoose.connection.collection(`${req.params.room_name}`).find().toArray((err, names) => {
        // console.log(rooM)
        if (err) {
            console.error(err)
        } else {
            const itemname = names.map((item) => {
                return item
                // console.log(item)
            })
            console.log(itemname)
            res.send(itemname)
        }
        // res.send(rooM)

    })
})

app.get('/room/message/display', async (req, res) => {
    const b = await mongoose.connection.collection('room:room1').find().toArray((err, names) => {
        if (err) {
            console.error(err)
        } else {
            const itemname = names.map((item) => {
                return item
                // console.log(item)
            })
            console.log(itemname)
            res.send(itemname)
        }


        // res.redirect('/')

    })

})


//just for testing purpose
app.get('/test', async (req, res) => {
    // mongoose.connection.db.listCollections().toArray((err, names) => {
    //     if (err) {
    //         console.error(err)
    //     } else {
    //         const itemname = names.map((item) => {
    //             return item.info.uuid.buffer
    //             // console.log(names)
    //         })
    //         // const it_name=JSON.stringify(itemname)
    //         console.log(itemname)
    //         // console.log(names)
    //     }

    // })

    const b = await mongoose.connection.collection('room:room1').find().toArray((err, names) => {
        if (err) {
            console.error(err)
        } else {
            const itemname = names.forEach((item) => {
                // return item
                console.log(item)
            })
            // console.log(itemname)
        }


        res.redirect('/')

    })
})

//Create new room
app.post('/room/new', async (req, res) => {
    // console.log(req.body)
    const user_name = req.body.roomName

    const Model = await Createmodel(user_name)
    try {
        const a = await new Model({
            Username: req.body.Username,
            Messagesend: req.body.Messagesend,
            Send: req.body.Send
        })
        const b = a.save()
        res.redirect('/')

    } catch (error) {
        console.error(error)

    }


})

app.post('/room/message/new', async (req, res) => {
    const newmsg = await new lol({

        Username: req.body.Username,
        Messagesend: req.body.Messagesend,
        Send: req.body.Send
        // date : req.body.date
    })
    db.collection(`${req.body.room_name}`).insertOne(newmsg, (err, ans) => {
        if (err) {
            console.error(err)
        } else {
            res.send(`${ans.ops}`)
            console.log(ans.ops)
        }
    })
})



app.listen(port, () => {
    console.log(`server started at ${port}`)
})