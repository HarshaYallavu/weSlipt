const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    groupDescription: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true
    }, 
    createdDate: {
        type: Date,
        default: Date.now()
    },
    notes: {
        type: String,
        default: "A Group created by users of WESplit to manage their order claims"
    },
    members: {
        type: [Schema.Types.ObjectId],
        required: true
    }
});

const groupModel = mongoose.model('groups', groupSchema);

module.exports = groupModel;