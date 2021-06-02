const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// INDEX - Show all posts
router.get('/', function(req, res) {
	Post.find({}, function(err, allPosts) {
		if (err) {
			res.send(err);
		} else {
			res.render('./index/index', { posts: allPosts });
		}
	});
});

module.exports = router;
