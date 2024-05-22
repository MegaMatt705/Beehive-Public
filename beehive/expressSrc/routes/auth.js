const { Router } = require('express');
const User = require('../database/schemas/user');
const router = Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');
const { hashPassword } = require('../utils/helpers');
const { authRegisterController } = require('../controllers/authc');
const user = require('../database/schemas/user');

/*
router.post('/login', async (req, res) => {
    
    const { email, password } = req.body;

    if (!email || !password) return res.send(400);

    const userDB = await user.findOne({ email });

    if (!userDB) return res.send(401);

    const isValid = comparePassword(password, userDB.password);

    if (isValid) {
        console.log('Authenticated Successfully!');
        req.session.user = userDB;
        return res.send(200);
    } else {
        console.log('Failed to Authenticate');
        return res.send(401);
    }
    
});
*/

router.post('/login', passport.authenticate('local'), (req, res) => {
    // Authentication successful, the user information is stored in req.user
    const username = req.user.username; // Access the username property from the user object
    const userId = req.user._id; // Access the user ID from the user object
    req.session.username = username;
    req.session.userId = userId; // Store the user ID in the session
    console.log('Session:', req.session);
    console.log('Session user:', req.session.username);
    console.log('Session user id', req.session.userId);
    res.status(200).json({ message: 'Logged in', username });
});


router.post('/register', authRegisterController);

router.get('/discord', passport.authenticate('discord'), (req, res) => {

    res.send(200);

});

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {

    res.send(200);

});

router.get('/profile', async (req, res) => {
    const username = req.session.username;
    console.log('Session:', req.session);
    console.log('username:', username);
    console.log('Session user:', req.session.username);

    const user = await User.findOne({ username });

    console.log(user);

    if (user) {
        res.status(200).json({ username });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}
);

router.get('/id', async (req, res) => {
    const userId = req.session.userId;
    console.log('Fetching Session for profile:', req.session);
    console.log('Session: ', req.session);
    console.log('ID:', userId)

    try {
        const user = userId ? await User.findById(userId) : null;
        console.log('User for profile:', userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(userId); 
        }
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ message: 'Error querying database' });
    }
})

router.post('/update-bio', async (req, res) => {
    const userId = req.session.userId;
    const { newBio } = req.body;

    console.log('UserID:', userId);
    console.log('New Bio:', newBio);

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.bio = newBio;
        await user.save();

        res.json({ message: 'Bio updated successfully', bio: user.bio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/bio', async (req, res) => {
    const userId = req.session.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ bio: user.bio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post('/update-profile-picture', upload.single('newProfilePicture'), async (req, res) => {
    const userId = req.session.userId;
    const newProfilePicture = req.file;

    console.log('UserID:', userId);
    console.log('New Profile Picture:', newProfilePicture);

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePicture = newProfilePicture.buffer.toString('base64');
        await user.save();

        res.json({ message: 'Profile picture updated successfully', profilePicture: user.profilePicture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/profilePicture', async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profilePictureData = user.profilePicture;

        if (!profilePictureData) {
            return res.status(404).json({ message: 'Profile picture not found for the user' });
        }

        const imageFormat = 'jpeg';  

        res.writeHead(200, {
            'Content-Type': `image/${imageFormat}`,
            'Content-Length': Buffer.from(profilePictureData, 'base64').length
        });
        res.end(Buffer.from(profilePictureData, 'base64'));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;