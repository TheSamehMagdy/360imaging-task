const mongoose = require('mongoose');
const Comment = require('./comment');

// SCHEMA SETUP
var postSchema = new mongoose.Schema(
	{
		title: String,
		body: String,
		image: String,
		author: String,
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment'
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
