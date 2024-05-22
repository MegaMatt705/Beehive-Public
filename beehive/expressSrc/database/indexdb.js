const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=monosh+2.0.1')
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log(err));