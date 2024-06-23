const express = require('express')
const { Product, validate} = require('../models/Product')
const router = express.Router()
const upload = require('../multer-config')

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
    
        if (!req.file) return res.status(400).send('Image file is required.')
    
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file.path  // Save image path to database
        })
    
        await product.save()
        res.send(product)
    } catch (error) {
        res.status(500).send('Creating product: ' + error.message)
    }
})

module.exports = router