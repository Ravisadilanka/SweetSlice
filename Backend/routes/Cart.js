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

        const cartItem = user.cart.find(item => item.productId == productId)

        if (cartItem) {
            cartItem.quantity += quantity
        } else {
            user.cart.push({ productId, quantity })
        }

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

// Remove products from cart
router.delete('/:cartItemId', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) return res.status(400).send('Invalid user.')

        const cartItemId = req.params.cartItemId
        const itemIndex = user.cart.findIndex(item => item._id == cartItemId)

        if (itemIndex === -1) return res.status(404).send('Item not found in cart.')

        user.cart.splice(itemIndex, 1)

        await user.save()

        res.send(user.cart)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Something went wrong.')
    }
})

module.exports = router