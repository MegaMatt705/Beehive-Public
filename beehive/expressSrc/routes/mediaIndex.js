const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalName)); // Appends the file extension
    }
});

const upload = multer({ storage: storage });

module.exports = {
    upload: upload
};

app.set('view engine', 'ejs');

app.get('/upload', (req, res) => {

    res.render('upload');

});

app.post('/upload', upload.single('image'), (req, res) => {

    res.send('media uploaded');

});

app.listen(3001);

console.log('3001 port');