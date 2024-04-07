const express = require('express');
const articleController = require('../controllers/articleControllers.js');
const fetchUser = require('../middleware/fetchUser.js');

const router = express.Router();

router.post('/submitArticle',articleController.submitArticle);
router.post('/getAllArticles', fetchUser,articleController.getAllArticle);
router.post('/getArticleById',articleController.getArticleById);
router.post('/articleByUserId',articleController.getArticleByUserId);
router.post('/deleteArticle',articleController.deleteArticle);
router.post('/updateArticle',articleController.updateArticle);
router.post('/likeArticle', fetchUser, articleController.likeArticle)

// Comments
router.post('/comment', articleController.addComment);
router.post('/comment/reply', articleController.replyToComment);
router.post('/delete/comment', articleController.deleteComment);
router.post('/delete/comment/reply', articleController.deleteReply);


module.exports = router;
