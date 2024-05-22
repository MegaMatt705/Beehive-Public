const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    username: {
        type: mongoose.SchemaTypes.String,
        required: true, 
        unique: true,
    },

    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
    },

    title: {
        type: String,
        required: true,
        min: 4,
    },

    photo: {
        type: String,
        default: '',
    },

    likes: {
        type: [String],
        default: [],
    },

    liked: {
        type: Boolean,
        default: false,
    },
    
    comments: {
        type: [String],
        default: [],
    },

    jobTitle: {
        type: String,
        required: true,
        min: 4,
    },

    jobDescription: {
        type: String,
        required: true,
        min: 10,
    },

    jobLocation: {
        type: String,
        required: true,
        min: 2,
    },

});

module.exports = mongoose.model('posts', postSchema);