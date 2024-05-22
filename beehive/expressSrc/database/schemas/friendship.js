const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    requester: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'blocked'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Friendship', friendshipSchema);
