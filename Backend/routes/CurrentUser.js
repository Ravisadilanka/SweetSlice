const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User } = require('../models/User')
const auth = require('../middleware/auth')

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

module.exports = router