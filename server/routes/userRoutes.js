const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtKey = process.env.JWT_KEY;
const multer = require('multer');
const fetchUser = require('../middleware/fetchUser')

const router = express.Router();

const storage = multer.memoryStorage(); // Use memory storage for simplicity, you can configure it to store files on disk if needed
const upload = multer({ storage: storage });

router.get('/getLoginUser', fetchUser, async (req, res) => {
  res.json(req.user);
})


router.post('/getMultipleUsersByIds', fetchUser, async (req, res) => {
  try {
    const userIds = req.body.userIds.map(obj => obj._id); // Extracting _id from each object
    const users = await User.find({ _id: { $in: userIds } }).select('-password -bio -email -following');

    // Check if any users are found
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Map users and add isFollowed property
    const updatedUsers = users.map(user => ({
      ...user.toObject(),
      isFollowed: user.followers.includes(req.user.userId)
    }));

    res.json(updatedUsers);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});



router.post('/activateUser', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId }).select('-password');
    const activatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          verified: true
        }
      },
      { new: true }
    );
    const token = jwt.sign({ userId: user._id }, jwtKey);
    res.header('Authorization', `Bearer ${token}`).json({ loginStatus: 'success', message: 'Account Activated', 'Authorization': `${token}` });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.post('/getUserByUserId', fetchUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId }).select('-password');

    let updatedUser = { ...user.toObject(), isFollowed: user.followers.includes(req.user.userId) };


    res.json(updatedUser);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});


router.post('/editProfile', upload.single('image'), async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const user = jwt.verify(token, jwtKey);
    const updatedUser = await User.findOneAndUpdate(
      { _id: user.userId },
      {
        $set: {
          profileImage: req.body.profileImage,
          username: req.body.username,
          bio: req.body.bio
        }
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json({ message: 'Profile updated succesfully' });
    }
  }
  catch (err) {
    console.log(err)
  }
})

router.post('/testlogin', async (req, res) => {
    res.json({message:"working"})
})


router.post('/followUser', fetchUser, async (req, res) => {
  try {
    console.log(req.body.userToFollow)
    const userId = req.user.userId;
    const userToFollowId = req.body.userToFollow._id;
    if (userId == userToFollowId) {
    res.status(500).json({ message: "Cannot follow yourself" });
    return;
    } 
  const isUserFollowed = await User.exists({ _id: userToFollowId, followers: { $in: [userId] } });

  if (isUserFollowed) {
    const updatedFollowers = await User.findOneAndUpdate(
      { _id: userToFollowId },
      { $pull: { followers: userId } },
      { new: true }
    );
    if (updatedFollowers) {
      const updateCurrentUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { following: userToFollowId } },
        { new: true }
      )
      if (updateCurrentUser) {
        res.status(200).json({ message: "Unfollowed User successfully" });
      }
    } else {
      res.status(500).json({ message: "Failed to Unfollow user" });
    }
  } else {
    // User has not liked the article yet, so like it
    const updatedFollowers = await User.findOneAndUpdate(
      { _id: userToFollowId },
      { $push: { followers: userId } },
      { new: true }
    );
    if (updatedFollowers) {
      const updateCurrentUser = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { following: userToFollowId } },
        { new: true }
      )
      if (updateCurrentUser) {
        res.status(200).json({ message: "Followed User successfully" });
      }
    } else {
      res.status(500).json({ message: "failed to follow user" });
    }
  }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
})


module.exports = router;
