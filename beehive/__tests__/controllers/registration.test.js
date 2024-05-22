// FILEPATH: /Users/satvikverma/Documents/GitHub/csc648-04-fall23-csc648-04-fall23-team02/beehive/expressSrc/__tests__/controllers/authc.test.js

const request = require('supertest');
const express = require('express');
const { authRegisterController } = require('../../expressSrc/controllers/authc');
const User = require('../../expressSrc/database/schemas/user');
const { hashPassword } = require('../../expressSrc/utils/helpers');

jest.mock('../../expressSrc/database/schemas/user');
jest.mock('../../expressSrc/utils/helpers');

const app = express();
app.use(express.json());
app.post('/register', authRegisterController);

describe('Auth Register Controller Test', () => {
    it('should return 400 if user already exists', async () => {
        const userData = { username: 'test', email: 'test@test.com', password: 'password' };
        User.findOne.mockResolvedValue(userData);

        const res = await request(app)
            .post('/register')
            .send(userData);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ msg: 'User already exists!' });
    });

    it('should register a new user successfully', async () => {
        const userData = { username: 'test', email: 'test@test.com', password: 'password' };
        User.findOne.mockResolvedValue(null);
        hashPassword.mockResolvedValue('hashedPassword');
        User.create.mockResolvedValue(userData);

        const res = await request(app)
            .post('/register')
            .send(userData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({ msg: 'Registration successful' });
    });
});