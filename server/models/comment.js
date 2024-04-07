const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment:{
      type: String,
      required:true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    childComment:[{
      type: Schema.Types.ObjectId,
      ref:'Comment'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;