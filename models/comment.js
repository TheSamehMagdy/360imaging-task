const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
	{
		text: String,
		author: String,
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
