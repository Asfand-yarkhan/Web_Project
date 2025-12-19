const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerEmail: {
        type: String,
        required: true
    },
    items: [
        {
            productId: Number,
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Placed', 'Processing', 'Delivered'],
        default: 'Placed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
