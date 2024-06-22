const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const signup = require('./routes/Signup')
const login = require('./routes/Login')
const currentUser = require('./routes/CurrentUser')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/signup', signup)
app.use('/api/login', login)
app.use('/api/users', currentUser)

// Connect to MongoDB
if (app.get('env') === 'development') {
    mongoose.connect('mongodb://localhost:27017/SweetSlice')
        .then(() => console.log('MongoDB Compass Connected'))
        .catch((err) => console.log('MongoDB Compass connection error:', err))
} else {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Atlas Connected'))
        .catch((err) => console.log('MongoDB Atlas connection error:', err))
}

const port = 3000
app.listen(port, () => console.log(`Server is running on port ${port}`))