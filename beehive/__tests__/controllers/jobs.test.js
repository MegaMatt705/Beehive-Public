// FILEPATH: /Users/satvikverma/Documents/GitHub/csc648-04-fall23-csc648-04-fall23-team02/beehive/expressSrc/__tests__/routes/jobs.test.js

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Job = require('../../expressSrc/database/schemas/jobSchema');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Job Model Test', () => {
    it('should create & save job successfully', async () => {
        const jobData = { title: 'Test Job', description: 'This is a test job', location: 'Test Location' };
        const validJob = new Job(jobData);
        const savedJob = await validJob.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedJob._id).toBeDefined();
        expect(savedJob.title).toBe(jobData.title);
        expect(savedJob.description).toBe(jobData.description);
        expect(savedJob.location).toBe(jobData.location);
    });
});