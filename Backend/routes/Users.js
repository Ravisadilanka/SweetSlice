const express = require('express')
const router = express.Router()
const { User } = require('../models/User')

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.send(users)
    } catch (error) {
        res.status(500).send('Server Error')
    }
})

//Update users
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }, { new: true}).select('-password')

        if (!user) return res.status(404).send('User not found')

        await user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send('Server Error')
    }
})

//Delete users
router.delete('/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).send('User not found')

        res.send(user)
    } catch (error) {
        res.status(500).send('Server Error')
    }
})

module.exports = router