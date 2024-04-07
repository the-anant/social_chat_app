const User = require("../models/user.js");
const Article = require("../models/article.js");
const Comment = require("../models/comment.js");

const submitArticle = async (req, res) => {
  const LoginUser = req.body.loginUser;
  const user = await User.findOne({ _id: LoginUser.userId });
  const newContent = new Article({
    ops: req.body.content,
    title: req.body.title,
    headerImage: req.body.headerImage,
    username: user.username,
    user: user._id,
  });
  newContent.save();
  res.end();
};

const getAllArticle = async (req, res) => {
  try {
  const userId = req.user.userId; // Assuming you have the userId of the current user

    // Fetch all articles and populate user and likes fields
    let allArticles = await Article.find().sort({ _id: -1 }).populate(
      "user",
      "profileImage username isPremium"
    ).populate({     
      path: "likes",
      select: "username"
    });
    
    

    // Map over articles to add isLiked, likedBy, and commentCount properties
    allArticles = allArticles.map((article) => {
      const isLiked = article.likes.some(user => user._id.equals(userId)); // Check if current user has liked the article
      const likedBy = article.likes.map(user => user.username);
      return {
        ...article.toObject(),
        isLiked: isLiked,
        likedBy: likedBy,
        commentCount: article.comment.length
      };
    });

    // Shuffle the articles (if needed)
    const shuffleComparison = () => Math.random() - 0.5;
    // allArticles.sort(shuffleComparison);

    res.json(allArticles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};



const getArticleById = async (req, res) => {
  try {
    const articleId = req.body.id;
    const article = await Article.findOne({ _id: articleId }).populate(
      "user",
      "profileImage username isPremium"
    ).populate({
      path: 'comment',
      options: { sort: { _id: -1 } },
      populate: [
        {
          path: 'user',
          select: 'profileImage username isPremium'
        },
        {
          path: 'childComment',
          populate: {
            path: 'user',
            select: 'profileImage username isPremium'
          }
        }
      ]
    });
    res.json({"data":article});
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Failed to fetch article" });
  }
};

const getArticleByUserId = async (req, res) => {
  try {
    const userId = req.body.userId;
    let articles = await Article.find({ user: userId }).populate(
      "user",
      "profileImage username isPremium"
    ).populate({
      path: "likes",
      select: "username"
    });

    articles = articles.map((article) => {
      const isLiked = article.likes.some(user => user._id.equals(userId)); // Check if current user has liked the article
      const likedBy = article.likes.map(user => user.username);
      return {
        ...article.toObject(),
        isLiked: isLiked,
        likedBy: likedBy
      };
    });

    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles by user:", error);
    res.status(500).json({ message: "Failed to fetch articles by user" });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const articleId = req.body.id;
    const deletedArticle = await Article.findOneAndDelete({ _id: articleId });
    if (deletedArticle) {
      res.status(200).json({ message: "Article deleted succesfully" });
    } else {
      res.status(500).json({ message: "failed to delete artilce" });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to delete artilce" });
  }
};

const updateArticle = async (req, res) => {
  try {
    
    const updatedArticle = await Article.findOneAndUpdate(
      { _id: req.body.articleId },
      {
      $set: {
        ops: req.body.content,
        title: req.body.title,
        headerImage: req.body.headerImage,
      },
    },
    { new: true }
    );
    if (updatedArticle) {
      res.status(200).json({ message: "Article updated succesfully" });
    } else {
      res.status(500).json({ message: "failed to update artilce" });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to update artilce" });
  }
  };
  
const likeArticle = async (req, res) => {
  try {
    
    const userId = req.user.userId;
    const articleId = req.body.articleId;
    const isUserLiked = await Article.exists({
    _id: articleId,
    likes: { $in: [userId] },
  });
  if (isUserLiked) {
    // User has already liked the article, so remove the like
    const updatedArticle = await Article.findOneAndUpdate(
      { _id: articleId },
      { $pull: { likes: userId } },
      { new: true }
    );
    if (updatedArticle) {
      res.status(200).json({ message: "Article Unliked successfully" });
    } else {
      res.status(500).json({ message: "Failed to Unlike article" });
    }
  } else {
    // User has not liked the article yet, so like it
    const updatedArticle = await Article.findOneAndUpdate(
      { _id: articleId },
      { $push: { likes: userId } },
      { new: true }
      );
      if (updatedArticle) {
        res.status(200).json({ message: "Article Liked successfully" });
      } else {
        res.status(500).json({ message: "Failed to Like article" });
          }
        }
      } catch (error) {
      res.status(500).json({ message: "Failed to Like article" });

    }
  };
  
  const addComment = async (req, res) => {
  try {
      const { comment, userId, articleId } = req.body;

      const article = await Article.findById(articleId);
      if (!article) {
          return res.status(404).json({ error: 'Article not found' });
      }

      const newComment = new Comment({ comment, user: userId });
      await newComment.save();

      article.comment.push(newComment);
      await article.save();
      await newComment.populate('user','profileImage username');
      res.status(201).json({data: newComment});
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const replyToComment = async (req, res) => {
  try {
      const { reply, userId, commentId } = req.body;

      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
          return res.status(404).json({ error: 'Parent comment not found' });
      }

      const newReply = new Comment({ comment: reply, user: userId });
      await newReply.save();
      
      parentComment.childComment.push(newReply);
      await parentComment.save();
      
      await newReply.populate([
        {
          path: 'user',
          select: 'profileImage username'
        },
        {
          path: 'childComment',
          populate: {
            path: 'user',
            select: 'profileImage username'
          }
        }
      ]);
      res.status(201).json({data: newReply});
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId, articleId } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Delete child comments
    await Comment.deleteMany({ _id: { $in: comment.childComment } });

    // Delete the comment itself
    await Comment.findByIdAndDelete(commentId);

    // Remove the association of the comment from the article
    const article = await Article.findById(articleId);
    if (article) {
      article.comment = article.comment.filter(id => id.toString() !== commentId);
      await article.save();
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const deleteReply = async (req, res) => {
  try {
    const { parentCommentId, replyId } = req.body;

    // Find the parent comment
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }

    // Find the reply within the parent comment
    const replyIndex = parentComment.childComment.findIndex(reply => reply._id.toString() === replyId);
    if (replyIndex === -1) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Delete child comments of the reply
    await Comment.deleteMany({ _id: { $in: parentComment.childComment[replyIndex].childComment } });

    // Delete the reply itself from the parent comment
    parentComment.childComment.splice(replyIndex, 1);
    await parentComment.save();

    res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const articleController = {
  submitArticle,
  getAllArticle,
  getArticleById,
  getArticleByUserId,
  deleteArticle,
  updateArticle,
  likeArticle,
  addComment,
  replyToComment,
  deleteComment,
  deleteReply
};

module.exports = articleController;
