const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");

const authRouter = require('./authRouter')
const apiRouter = require('./apiRouter')

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json({extended: true}))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use('/auth', authRouter)
app.use('/api', apiRouter)

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://maxzhovtyj:30042003@cluster0.5wwuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()