const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        event: {
            type: String,
            required: [true, 'Please provide a event'],
            enum: {
                values: [
                    'quiz',
                    'word-hunt',
                    'software-contest',
                    'web-design',
                    'ppt',
                    'marketing',
                ],
                message: 'Please select correct event',
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;
