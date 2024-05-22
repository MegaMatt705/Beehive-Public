// FILEPATH: /Users/satvikverma/Documents/GitHub/csc648-04-fall23-csc648-04-fall23-team02/beehive/__tests__/routes/mediaIndex.test.js

const multer = require('multer');
const path = require('path');
const mockFs = require('mock-fs');
const mediaIndex = require('../../expressSrc/routes/mediaIndex');

describe('multer diskStorage', () => {
    let mockFile, mockCb, mockReq, mockRes;

    beforeEach(() => {
        // Mock the filesystem
        mockFs({
            '../images': {},
        });

        // Mock a file and callback for multer
        mockFile = { originalName: 'test.jpg' };            
        mockCb = jest.fn();

        // Mock request and response for Express
        mockReq = { 
            file: mockFile, 
            headers: { 'content-length': '123' } // Add this line
        };
        mockRes = { send: jest.fn() };
    });

    afterEach(() => {
        // Restore the filesystem
        mockFs.restore();
    });

    it('should store files in the correct directory and generate the correct filename', () => {
        const upload = mediaIndex.upload;
        upload.single('image')(mockReq, mockRes, (err) => {
            expect(err).toBeUndefined();
            expect(mockReq.file.path).toMatch(/^..\/images\/\d+\.jpg$/);
        });
    });
});