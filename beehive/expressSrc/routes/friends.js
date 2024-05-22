const express = require("express");
const router = express.Router();
const User = require("../database/schemas/user");
const Friendship = require("../database/schemas/friendship");

router.get("/list-users", async (req, res) => {
  try {
    const currentUser = await User.findOne({ username: req.session.username });
    const currentUserId = currentUser._id;
    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "username"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/friends-list", async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const friends = await Friendship.find({
      $or: [
        { requester: currentUserId, status: "accepted" },
        { recipient: currentUserId, status: "accepted" },
      ],
    }).populate("requester recipient", "username");

    const friendList = friends.map((friendship) => {
      return friendship.requester._id.equals(currentUserId)
        ? {
            userId: friendship.recipient._id,
            username: friendship.recipient.username,
          }
        : {
            userId: friendship.requester._id,
            username: friendship.requester.username,
          };
    });

    res.json(friendList);
  } catch (error) {
    console.error("Error fetching friends list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/add-friend", async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { friendId } = req.body;

    // Check if a request already exists 
    const existingRequest = await Friendship.findOne({
      $or: [
        { requester: currentUserId, recipient: friendId },
        { requester: friendId, recipient: currentUserId }
      ],
      status: { $in: ["pending", "accepted"] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: "A friend request already sent or you are already friends." });
    }
    
    const newFriendship = new Friendship({
      requester: currentUserId,
      recipient: friendId,
      status: "pending"
    });

    await newFriendship.save();
    res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/requests", async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User identification failed" });
    }

    const currentUserId = req.user._id;
    const friendRequests = await Friendship.find({
      recipient: currentUserId,
      status: "pending",
    }).populate("requester", "username");

    res.json(
      friendRequests.map((request) => ({
        id: request._id,
        username: request.requester.username,
      }))
    );
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", errorDetails: error.message });
  }
});

router.post("/accept", async (req, res) => {
  try {
    const { friendshipId } = req.body;

    // Update the friendship status to 'accepted'
    const updatedFriendship = await Friendship.findByIdAndUpdate(
      friendshipId,
      { $set: { status: "accepted" } },
      { new: true }
    );

    if (!updatedFriendship) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/reject", async (req, res) => {
  try {
    const { friendshipId } = req.body;
    const currentUserId = req.user._id;

    // Update the friendship status to 'rejected'
    const updatedFriendship = await Friendship.findByIdAndUpdate(
      friendshipId,
      { $set: { status: "rejected" } },
      { new: true }
    );

    if (!updatedFriendship) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    res.json({
      message: "Friend request rejected",
      friendship: updatedFriendship,
    });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/count", async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const friendCount = await Friendship.countDocuments({
      $or: [
        { requester: currentUserId, status: "accepted" },
        { recipient: currentUserId, status: "accepted" },
      ],
    });

    res.json({ count: friendCount });
  } catch (error) {
    console.error("Error fetching friend count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/delete-friend", async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { friendId } = req.body;

    await Friendship.deleteOne({
      $or: [
        { requester: currentUserId, recipient: friendId },
        { requester: friendId, recipient: currentUserId },
      ],
      status: "accepted",
    });

    res.json({ message: "Friend successfully deleted" });
  } catch (error) {
    console.error("Error deleting friend:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
