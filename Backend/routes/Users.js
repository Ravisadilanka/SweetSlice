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

        await user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send('Server Error')
    }
})


module.exports = router