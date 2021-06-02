const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Post = require('./models/post');
const Comment = require('./models/comment');

// Requiring routes
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

// Connect to db
const dbUrl = process.env.DATABASEURL;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Use routes
app.use(indexRoutes);
app.use(postRoutes);
app.use(commentRoutes);

// Start server
app.listen(8000, () => console.log('listening on 8000'));
