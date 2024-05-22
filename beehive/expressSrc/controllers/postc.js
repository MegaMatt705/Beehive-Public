const Post = require('../database/schemas/postSchema');
const User = require('../database/schemas/user');
const Job = require('../database/schemas/jobSchema');
const mongoose = require('mongoose');

// CREATE
// ... (your imports and other functions)

let jobs = [];

const createJob = (req, res) => {
    const { title, description, location } = req.body;

    const newJob = {
        id: jobs.length + 1,
        title,
        description,
        location
    };

    jobs.push(newJob);

    res.status(201).json(newJob);
    res.status(500).json({ message: "Error creating job", error: err.toString() });
};

async function createPost(req, res) {
    try {
        const user = await User.findById(req.user.id);
        const { title, jobTitle, jobDescription, jobLocation } = req.body;

        await Post.create({
            title: title,
            username: req.user.username,
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            jobLocation: jobLocation,
        });

        const posts = await Post.find()
            .sort({ createdAt: -1 });

        return res.status(201).json(posts);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}
 
async function getUserPosts(req, res) {
    try {
        const posts = await Post.find({ user: req.params.id }).populate("userInfo");
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

async function getTimelinePosts(req, res) {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(400).json({ msg: "Current user not found" });
        }

        const posts = await Post.find()
            .populate("user")
            .sort({ createdAt: -1 });
        const currentUserPosts = await Post.find({ user: req.user.id })
            .populate("user")
            .sort({ createdAt: -1 });

        let timelinePosts = currentUserPosts.sort(
          (a, b) => b.createdAt - a.createdAt
        );
      
        const postIds = new Set();
        timelinePosts = timelinePosts.filter((post) => {
          if (!postIds.has(post._id.toString())) {
            postIds.add(post._id.toString());
            return true;
          }
          return false;
        });
      
        if (timelinePosts.length > 40) {
          timelinePosts = timelinePosts.slice(0, 40);
        } else if (timelinePosts.length < 10) {
          let otherPosts = posts
            .filter((post) => !timelinePosts.includes(post))
            .slice(0, 30);
          timelinePosts = [...otherPosts, ...timelinePosts].sort(
            (a, b) => b.createdAt - a.createdAt
          );
        }
      
        return res.status(200).json(timelinePosts);
      } catch (error) {
        return res.status(500).json(error.message);
      }
}

async function getOnePost(req, res) {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(500).json({ msg: "No such post with this id!" });
        } else {
            return res.status(200).json(post);
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

async function updatePost(req, res) {
    try {
        const post = await Post.findById(req.params.id)

        if (post.user.toString() === req.user.id.toString()) {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id,
                { $set: req.body }, { new: true });
            return res.status(200).json(updatedPost);
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(500).json({ msg: "No such post" })
        } else if (post.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ msg: "You can delete only your own posts" });
        } else {
            await Post.findByIdAndDelete(req.params.id);
            return res.status(200).json({ msg: "Post is successfully deleted" });
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

async function toggleLikePost(req, res) {
    try {
        const currentUserId = req.user.id;
        const post = await Post.findById(req.params.id);

        if (post.likes.includes(currentUserId)) {
            post.likes = post.likes.filter((id) => id !== currentUserId);
            post.liked = false;
            await post.save();
            return res.status(200).json({ post: post, msg: "Successfully unliked the post" });
        } else {
            post.likes.push(currentUserId);
            post.liked = true;
            await post.save();
            return res.status(200).json({ post: post, msg: "Successfully liked the post" });
        }

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

exports.create = async (postData) => {
    const post = new Post(postData);
    return await post.save();
};

module.exports = { 
    createJob, 
    createPost, // replace 'create' with 'createPost'
    getUserPosts, 
    getTimelinePosts, 
    getOnePost, 
    updatePost, 
    deletePost, 
    toggleLikePost
};