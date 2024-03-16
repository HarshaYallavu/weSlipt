const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const claimModel = require('./claimModel');

const itemsSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    itemQuantity: {
        type: String,
        required: true
    }, 
    itemPrice: {
        type: Number,
        required: true
    },
    claims: [claimModel.claimSchema]
}, {_id: false});

// const itemsModel = mongoose.model('items', itemsSchema);
module.exports.itemSchema = itemsSchema;
// module.exports.itemModel = itemsModel;