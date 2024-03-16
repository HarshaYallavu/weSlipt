const mongoose = require('mongoose');
const itemModel = require('./itemModel');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderType:{
        type: String,
        default: 'Invoice-Upload'
    },
    storeName:{
        type: String
    },
    groupId:{
        type: Schema.Types.ObjectId,
        ref: 'group',
        required: true
    },
    invoiceOrderId: {
        type: String,
        default: 'INVOICE ORDER ID'
    },
    items: [itemModel.itemSchema]
});

//Middleware to validate the claims
orderSchema.pre('updateOne', function(){
    console.log('Executing pre validation middleware on Order Schema');
})

const orderModel = mongoose.model('orders', orderSchema);

module.exports.orderModel = orderModel;