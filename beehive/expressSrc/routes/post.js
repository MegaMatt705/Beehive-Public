const { Router } = require('express');
const express = require('express');
const controller = require( '../controllers/postc');
const router = Router();

// GET
router.get('/retrieve', controller.getUserPosts, (req, res) => {

    console.log(controller.getUserPosts);
    res.send(200);

});

router.get('/timeline/posts', controller.getTimelinePosts, (req, res) => {

    console.log(controller.getTimelinePosts);
    res.send(200);

});

router.get('/find/:id', controller.getOnePost, (req, res) => {

    console.log(controller.getOnePost);
    res.send(200);

});

// POST
router.post('/create', controller.createPost, (req, res) => {

    console.log(controller.createPost);
    res.status(200);

});

//PUT
router.put('/update/:id', controller.updatePost, (req, res) => {

    console.log(controller.updatePost);
    res.status(201);

});
router.put('/toggle-like/:id', controller.toggleLikePost, (req, res) => {

    console.log(controller.toggleLikePost);
    res.status(201);

});

//DELETE
router.delete('/delete/:id', controller.deletePost, (req, res) => {

    console.log(controller.deletePost);
    res.status(200);

});

module.exports = router;