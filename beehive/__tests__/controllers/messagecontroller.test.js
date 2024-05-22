// FILEPATH: /Users/satvikverma/Documents/GitHub/csc648-04-fall23-csc648-04-fall23-team02/beehive/expressSrc/__tests__/controllers/messageController.test.js

const request = require('supertest');
const express = require('express');
const messageController = require('../../expressSrc/controllers/messagecontroller');
const Message = require('../../expressSrc/database/schemas/messagedb');

jest.mock('../../expressSrc/database/schemas/messagedb');

const app = express();
app.use(express.json());
app.post('/sendMessage', messageController.sendMessage);

describe('Message Controller Test', () => {
    it('should save a message successfully', async () => {
        const messageData = { content: 'Test Message', senderId: '123', conversationId: '456' };
        Message.mockImplementation(() => ({
            save: () => Promise.resolve(messageData)
        }));

        const res = await request(app)
            .post('/sendMessage')
            .send(messageData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(messageData);
    });

    it('should handle error when saving a message', async () => {
        const messageData = { content: 'Test Message', senderId: '123', conversationId: '456' };
        Message.mockImplementation(() => ({
            save: () => Promise.reject(new Error('Failed to send message'))
        }));

        const res = await request(app)
            .post('/sendMessage')
            .send(messageData);

        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({ error: 'Failed to send message' });
    });
});