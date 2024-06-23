const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const signup = require('./routes/Signup')
const login = require('./routes/Login')
const currentUser = require('./routes/CurrentUser')
const product = require('./routes/Product')
const cart = require('./routes/Cart')
const purchaseItems = require('./routes/PurchaseItems')
const users = require('./routes/Users')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/signup', signup)
app.use('/api/login', login)
app.use('/api/users', currentUser)
app.use('/api/dashboard/products', product)
app.use('/api/dashboard/users', users)
app.use('/api/cart', cart)
app.use('/api/purchase', purchaseItems)

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