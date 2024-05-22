// Import necessary modules
const { comparePassword } = require('../../expressSrc/utils/helpers');
const bcrypt = require('bcryptjs');

describe('comparePassword function', () => {
    // Test for correct password
    it('should return true when the password is correct', async () => {
        const password = 'testPassword';
        const hashedPassword = bcrypt.hashSync(password, 10);
        const isValid = await comparePassword(password, hashedPassword);
        expect(isValid).toBe(true);
    });

    // Test for incorrect password
    it('should return false when the password is incorrect', async () => {
        const password = 'testPassword';
        const incorrectPassword = 'incorrectPassword';
        const hashedPassword = bcrypt.hashSync(password, 10);
        const isValid = await comparePassword(incorrectPassword, hashedPassword);
        expect(isValid).toBe(false);
    });
});