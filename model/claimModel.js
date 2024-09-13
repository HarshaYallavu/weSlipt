const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const claimsSchema = new Schema({
    claimedBy: {
        type: Schema.Types.ObjectId,
        required: true
    }, //reference User
    claimedQuantity: {
        type: Number,
        required: true
    }, 
    claimedPriceShare: {
        type: Number,
        required: true
    }
}, {_id:false});

// const claimsModel = mongoose.model('claims', claimsSchema);

module.exports.claimSchema = claimsSchema;
// module.exports.claimModel = claimsModel;