const express = require('express')
const { Product, validate } = require('../models/Product')
const router = express.Router()
const upload = require('../multer-config')
const Joi = require('joi')

// Create products
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

// Get all products
router.get('/', async (req, res) => {
    try {
        const product = await Product.find()
        res.send(product)
    } catch (error) {
        res.status(500).send('Server error')
    }
})

//update products
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { error } = validateProductUpdate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file.path
        }, { new: true })
        if (!product) return res.status(404).send('Product not found')

        res.send(product)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

//Delete products
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) return res.status(404).send('Product not found')

        res.send({ message: `${product.name} deleted successfully` })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

function validateProductUpdate(product) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50),
        description: Joi.string().min(2).max(150),
        price: Joi.number()
    })
    return schema.validate(product)
}

module.exports = router