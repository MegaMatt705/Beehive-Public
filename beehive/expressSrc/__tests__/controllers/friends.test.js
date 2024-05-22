const User = require('../database/schemas/user');
const FriendRequest = require('../database/schemas/friendRequest');
const router = require('../routes/friends');

// Mock the Mongoose models
jest.mock('../database/schemas/user');
jest.mock('../database/schemas/friendRequest');

// Test GET /status/:userId
it('should return friendship status correctly', async () => {
  const userId = 'testUserId';
  const currentUserId = 'currentUserTestId';

  User.findById.mockResolvedValueOnce({ friends: [] });
  FriendRequest.findOne.mockResolvedValueOnce(null);

  const req = mockRequest({}, { userId }, { _id: currentUserId });
  const res = mockResponse();

  await router.get('/status/:userId', req, res);

  expect(User.findById).toHaveBeenCalledWith(currentUserId);
  expect(FriendRequest.findOne).toHaveBeenCalledWith({
    requester: currentUserId,
    recipient: userId,
    status: 'pending'
  });
  expect(res.json).toHaveBeenCalledWith({
    isFriend: false,
    friendRequestSent: false,
    friendRequestReceived: false
  });
});

// Test GET /requests
it('should return list of friend requests', async () => {
  const userId = 'testUserId';
  const friendRequests = [{ id: '1', status: 'pending' }];

  FriendRequest.find.mockResolvedValueOnce(friendRequests);

  const req = mockRequest({}, {}, { _id: userId });
  const res = mockResponse();

  await router.get('/requests', req, res);

  expect(FriendRequest.find).toHaveBeenCalledWith({
    recipient: userId,
    status: 'pending'
  });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(friendRequests);
});

// Test POST /request
it('should create a friend request', async () => {
  const recipientId = 'testRecipientId';
  const requesterId = 'testRequesterId';

  FriendRequest.findOne.mockResolvedValueOnce(null);
  const friendRequest = new FriendRequest({
    requester: requesterId,
    recipient: recipientId,
    status: 'pending'
  });
  friendRequest.save = jest.fn().mockResolvedValueOnce({});

  const req = mockRequest({ recipientId }, {}, { _id: requesterId });
  const res = mockResponse();

  await router.post('/request', req, res);

  expect(FriendRequest.findOne).toHaveBeenCalledWith({
    requester: requesterId,
    recipient: recipientId
  });
  expect(res.send).toHaveBeenCalledWith('Friend request sent successfully.');
});

// Test PUT /accept
it('should accept a friend request', async () => {
  const requestId = 'testRequestId';
  const userId = 'testUserId';

  FriendRequest.findOneAndUpdate.mockResolvedValueOnce(true);

  const req = mockRequest({ requestId }, {}, { _id: userId });
  const res = mockResponse();

  await router.put('/accept', req, res);

  expect(FriendRequest.findOneAndUpdate).toHaveBeenCalledWith(
    { _id: requestId, recipient: userId },
    { status: 'accepted' },
    { new: true }
  );
  expect(res.send).toHaveBeenCalledWith('Friend request accepted.');
});

// Test PUT /reject
it('should reject a friend request', async () => {
  const requestId = 'testRequestId';
  const userId = 'testUserId';

  FriendRequest.findOneAndUpdate.mockResolvedValueOnce(true);

  const req = mockRequest({ requestId }, {}, { _id: userId });
  const res = mockResponse();

  await router.put('/reject', req, res);

  expect(FriendRequest.findOneAndUpdate).toHaveBeenCalledWith(
    { _id: requestId, recipient: userId },
    { status: 'rejected' },
    { new: true }
  );
  expect(res.send).toHaveBeenCalledWith('Friend request rejected.');
});

// Test DELETE /cancel
it('should cancel a friend request', async () => {
  const requestId = 'testRequestId';
  const userId = 'testUserId';

  FriendRequest.findOneAndDelete.mockResolvedValueOnce(true);

  const req = mockRequest({ requestId }, {}, { _id: userId });
  const res = mockResponse();

  await router.delete('/cancel', req, res);

  expect(FriendRequest.findOneAndDelete).toHaveBeenCalledWith(
    { _id: requestId, requester: userId }
  );
  expect(res.send).toHaveBeenCalledWith('Friend request cancelled.');
});
