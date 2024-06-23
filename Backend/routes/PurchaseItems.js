const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const auth = require('../middleware/auth');

// Purchase all items from cart
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).send('Invalid user.');

        if (user.cart.length === 0) return res.status(400).send('Cart is empty.');

        // Move items from cart to purchasedItems
        for (let item of user.cart) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(400).send(`Product with ID ${item.productId} not found.`);
            
            // Check if the product is already in the purchasedItems array
            const purchasedItem = user.purchasedItems.find(pItem => pItem.productId.toString() === item.productId.toString());
            if (purchasedItem) {
                purchasedItem.quantity += item.quantity; // Update quantity if already purchased
            } else {
                user.purchasedItems.push({ productId: item.productId, quantity: item.quantity });
            }
        }

        // Clear the cart after purchase
        user.cart = [];

        // Save the updated user document
        await user.save();

        res.send('Purchase successful and cart cleared.');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Something went wrong.');
    }
});

//View purchased items
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(`purchasedItems.productId`)
        if (!user) return res.status(400).send('Invalid user.')

        res.send(user.purchasedItems)
    } catch(error) {
        res.status(500).send('Something went wrong.')
    }
})

module.exports = router;
