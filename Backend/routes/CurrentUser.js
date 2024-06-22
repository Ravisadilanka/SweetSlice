const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { User } = require('../models/User')
const auth = require('../middleware/auth')

// Current User
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        if(!user) return res.status(404).send('User not found')
        res.send(user)
    } catch (ex) {
        console.error(ex.message);
        res.status(500).send('Server Error');
    }
})

//Update current user
router.put('/me', auth, async (req, res) => {
    try {
        const { error } = validateUserUpdate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const user = await User.findByIdAndUpdate(req.user._id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }, {new: true}).select('-_id -password')

        res.send(user)

    } catch (ex) {
        console.error(ex.message);
        res.status(500).send('Server Error');
    }
})

function validateUserUpdate(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50),
        lastName: Joi.string().min(2).max(50)
    })
    return schema.validate(user)
}

module.exports = router