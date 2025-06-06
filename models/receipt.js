const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const receiptSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['lawn', 'chiffon', 'cotton', 'karandi', 'linen', 'silk', 'net', 'organza', 'cambric', 'khaddar','other'],
        required: true,
    }

});

module.exports = mongoose.model("Receipt", receiptSchema);