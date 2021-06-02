const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');

// Show new comment form
router.get('/posts/:id/comments/new', function(req, res) {
	Post.findById(req.params.id, function(err, post) {
		if (err) {
			console.log('error', err.message);
			return res.redirect('back');
		} else {
			res.render('./comments/new', { post: post });
		}
	});
});

// Create and save new comment
router.post('/posts/:id/comments', function(req, res) {
	Post.findById(req.params.id).populate('comments').exec(function(err, post) {
		if (err) {
			console.log('error', err.message);
			return res.redirect('back');
		}
		Comment.create(req.body.comment, function(err, comment) {
			if (err) {
				console.log('error', err.message);
				return res.redirect('back');
			}
			//add associated place to the comment
			comment.post = post;
			//add comment to post
			post.comments.push(comment);
			//save post
			post.save();
			res.redirect('/posts/' + post._id);
		});
	});
});

// Show comment edit form
router.get('/posts/:id/comments/:comment_id/edit', function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			console.log('error', err.message);
			return res.redirect('back');
		}
		res.render('./comments/edit', { post_id: req.params.id, comment: foundComment });
	});
});

// Update and save comment
router.put('/posts/:id/comments/:comment_id', function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, { new: true }, function(err, updatedComment) {
		if (err) {
			console.log('error', err.message);
			return res.redirect('back');
		}
		Post.findById(req.params.id).populate('comments').exec(function(err, post) {
			if (err) {
				console.log('error', err.message);
				return res.redirect('back');
			}
			post.save();
			res.redirect('/posts/' + post._id);
		});
	});
});

// Delete comment
router.delete('/posts/:id/comments/:comment_id', function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			console.log('error', err.message);
			return res.redirect('back');
		}
		Post.findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.comment_id } }, { new: true })
			.populate('comments')
			.exec(function(err, post) {
				if (err) {
					console.log('error', err.message);
					return res.redirect('back');
				}
				post.save();
				res.redirect('/posts/' + req.params.id);
			});
	});
});

module.exports = router;
