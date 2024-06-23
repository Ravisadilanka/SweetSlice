const express = require('express')
const router = express.Router()
const { User } = require('../models/User')
const { Product } = require('../models/Product')
const auth = require('../middleware/auth')

// Add product to cart
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) return res.status(400).send('Invalid user.')

        const { productId, quantity } = req.body

        const product = await Product.findById(req.body.productId)
        if (!product) return res.status(400).send('Invalid product.')

        user.cart.push({ productId, quantity })
        await user.save()

        res.send(user.cart)
    } catch (error) {
        res.status(500).send('Something went wrong.')
    }
})

// View cart
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(`cart.productId`)
        if (!user) return res.status(400).send('Invalid user.')

        res.send(user.cart)
    } catch(error) {
        res.status(500).send('Something went wrong.')
    }
})

module.exports = router