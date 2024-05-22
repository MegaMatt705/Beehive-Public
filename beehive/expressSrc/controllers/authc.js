const User = require('../database/schemas/user');
const { hashPassword } = require('../utils/helpers');

async function authRegisterController(req, res) {
    const { username, email, password } = req.body;
    const userDB = await User.findOne({ username, email });
    
    if (userDB) {
        res.status(400).send({ msg: 'User already exists!' });
    } else {
        const hashedPassword = await hashPassword(password);
        
        // Create a new user with the hashed password
        const newUser = await User.create({ username, email, password: hashedPassword });
        
        res.status(201).send({ msg: 'Registration successful' });
    }
}


module.exports = { authRegisterController };