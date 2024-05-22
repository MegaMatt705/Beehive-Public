const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },

    bio: {
        type: mongoose.SchemaTypes.String,
        required: false,
        unique: false,
    },

    profilePicture: {
        type: mongoose.SchemaTypes.String,
        required: false,
        unique: false,
    },
    
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date(),
    },
    friends: [{
        friendId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'blocked'],
            default: 'pending'
        }
    }],
});

module.exports = mongoose.model('User', userSchema);