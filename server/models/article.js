const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    ops: {
      type: Array,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    username:{
      type: String,
      required:true,
    },
    profileImage: {
      type: String,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    headerImage:{
      type: String
    },
    title:{
      type: String
    },
    comment:[{
      type: Schema.Types.ObjectId,
      ref:'Comment'
    }]
  });

  
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;