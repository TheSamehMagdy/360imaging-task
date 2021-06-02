const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');

// Show new post form
router.get('/posts/new', function(req, res) {
	res.render('./posts/new');
});

// Show one post
router.get('/posts/:id', function(req, res) {
	// find post with provided ID
	Post.findById(req.params.id)
		.populate('comments')
		.populate({
			path: 'comments',
			options: { sort: { createdAt: -1 } }
		})
		.exec(function(err, foundPost) {
			if (err || !foundPost) {
				console.log(err, 'Post not found.');
				res.redirect('back');
			} else {
				// render post template with that post
				res.render('./posts/show', { post: foundPost });
			}
		});
});

// Create and save post
router.post('/posts', function(req, res) {
	// get data from form and add to posts array
	let title = req.body.post.title;
	let body = req.body.post.body;
	let image = req.body.post.image;
	let author = req.body.post.author;
	var newPost = { title: title, body: body, image: image, author: author };
	// Create a new post and save to DB
	Post.create(newPost, function(err, newlyCreated) {
		if (err) {
			console.log(err, 'Failed to create new post.');
			res.redirect('/');
		} else {
			res.redirect('/');
		}
	});
});

// Show edit post form
router.get('/posts/:id/edit', function(req, res) {
	Post.findById(req.params.id, function(err, foundPost) {
		if (err) {
			console.log(err, 'Post not found.');
			res.redirect('/');
		}
		res.render('./posts/edit', { post: foundPost });
	});
});

// Update and save post
router.put('/posts/:id', function(req, res) {
	Post.findById(req.params.id, async function(err, post) {
		if (err) {
			console.log(err, 'Post not found.');
			res.redirect('/');
		} else {
			post.title = req.body.post.title;
			post.image = req.body.post.image;
			post.body = req.body.post.body;
			await post.save();
			res.redirect('/posts/' + req.params.id);
		}
	});
});

// Delete post
router.delete('/posts/:id', function(req, res) {
	Post.findById(req.params.id, function(err, post) {
		if (err) {
			console.log(err, 'Post not found.');
			res.redirect('/');
		} else {
			post.remove();
			res.redirect('/');
		}
	});
});

module.exports = router;
