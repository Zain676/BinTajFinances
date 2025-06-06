const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        default: Date.now(),
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

module.exports = mongoose.model("Purchase", purchaseSchema);