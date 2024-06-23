const Joi = require('joi')
const { required } = require('joi')
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true
    },
    description: {
        type: String,
        minlength: 2,
        maxlength: 150,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const Product = new mongoose.model('Products', productSchema)

function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(2).max(150).required(),
        price: Joi.number().required()
    })
    return schema.validate(product)
}

exports.Product = Product
exports.validate = validateProduct