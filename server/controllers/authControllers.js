const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtKey = process.env.JWT_KEY;
const bcrypt = require('bcrypt');
const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
require('firebase/compat/firestore');
require('firebase/auth')

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Handle errors
const handleErrors = (err) => {
  // here errors = { email= '', password = ''}
  let errors = {}

  // Duplicate Value Error code
  if (err.code === 11000) {
    errors.email = 'Email is already Registered'
    return errors;
  }

  // Validation Errors
  if (err.message.includes('User validation failed')) {
    //the properties is destructured from errors object by using ({ properties })
    Object.values(err.errors).forEach(({ properties }) => {
      if (properties.message !== "") {
        errors[properties.path] = properties.message;
      }
    })
  }
  return errors;
}


const user_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.check_user_credens(email, password);
    if (!user) {
      res.json({ loginStatus: 'failed' });
      return;
    }
    if (user.verified == false) {
      res.json({ loginStatus: 'failed', message: "Please verify your email" });
      return;
    }
    const token = jwt.sign({ userId: user._id }, jwtKey);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 300 * 3000, path: '/', sameSite: 'None' })
    res.header('Authorization', `Bearer ${token}`).json({ loginStatus: 'success', message: 'Login successful', 'Authorization': `${token}` });
    // res.status(201).json({ id: user._id})
  }
  catch (err) {
    res.status(201).json({ loginStatus: 'failed', message: 'Invalid Email or Password' })
  }
}

const userLoginWithGoogle = async (req, res) => {
  // console.log(req.body)
  // console.log(uid, email, photoURL, displayName);
  try {
    const { uid, email, photoURL, displayName } = req.body;
    const user = await User.findOne({ uid });
    if (!user) {
      const user = await User.create({ uid, username: displayName, email, profileImage: photoURL });
      const token = jwt.sign({ userId: user._id }, jwtKey);
      res.cookie('jwt', token, { httpOnly: true, maxAge: 300 * 3000, path: '/', sameSite: 'None' })
      res.header('Authorization', `Bearer ${token}`).json({ loginStatus: 'success', message: 'Login successful', 'Authorization': `${token}` });
    }
    else {
      const token = jwt.sign({ userId: user._id }, jwtKey);
      res.cookie('jwt', token, { httpOnly: true, maxAge: 300 * 3000, path: '/', sameSite: 'None' })
      res.header('Authorization', `Bearer ${token}`).json({ loginStatus: 'success', message: 'Login successful', 'Authorization': `${token}` });
    }
    // res.status(201).json({ id: user._id})
  }
  catch (err) {
    console.log(err)
    const errors = handleErrors(err);
    res.status(200).json({ loginStatus: 'failed', message: errors.email })
  }

  // try{
  //   const user = await User.check_user_credens( email, password );
  //   if(!user){
  //     res.json({ loginStatus : 'failed'});       
  //   }
  //   const token = jwt.sign({ userId: user._id }, jwtKey);
  //   res.cookie('jwt',token, {httpOnly:true , maxAge:300*3000, path: '/',sameSite: 'None'})
  //   res.header('Authorization', `Bearer ${token}`).json({ loginStatus : 'success' , message: 'Login successful','Authorization': `${token}` });
  //   // res.status(201).json({ id: user._id})
  // }
  // catch(err){
  //   res.status(201).json({ loginStatus : 'failed'})
  // }
}

const user_register = async (req, res) => {
  console.log("login Api",req.body)
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password, verified:true }) // for ignoring email verification we use veriried:true 
    if (user) {
      const actionCodeSettings = {
        url: `https://feathery-client.vercel.app/${user._id}/`,
        // url: `http://localhost:8000/${user._id}/`,
        // url: `https://feathery.in/${user._id}/`,
        handleCodeInApp: true,
      };
      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(async () => {
          const token = jwt.sign({ userId: user._id }, jwtKey);
          res.cookie('jwt', token, { httpOnly: true, maxAge: 300 * 3000, path: '/', sameSite: 'None' })
          res.header('Authorization', `Bearer ${token}`).json({ loginStatus: 'success', message: 'Email activation link sent to your inbox.', 'Authorization': `${token}` });
        })
        .catch((err) => {
          const errors = handleErrors(err);
          res.status(400).json({ loginStatus: 'failed', errors: err })
        }
        );
    }
  }
  catch (err) {
    console.error(err);
    const errors = handleErrors(err);
    res.status(200).json({ loginStatus: 'failed', message: errors.email })
  }
}
// const user_register = async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     // const user = await User.create({ username, email, password, verified: false })
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(200).json({ loginStatus: 'failed', message: 'User already registered' });
//     }
//     // const user = await User.create({ username, email, password, verified: false });
//     const user = {
//       "_id":"2"
//     }
//     const actionCodeSettings = {
//       url: `https://feathery-client.vercel.app/${user._id}/`,
//       // url: `http://localhost:8000/${user._id}/`,
//       // url: `https://feathery.in/${user._id}/`,
//       handleCodeInApp: true,
//     }
//       const auth = firebase.auth();
//       await auth.sendSignInLinkToEmail(email, actionCodeSettings);
//       // If sending email is successful, proceed to create the user
//       // const token = jwt.sign({ userId: user._id }, jwtKey);
//       // res.cookie('jwt', token, { httpOnly: true, maxAge: 300 * 3000, path: '/', sameSite: 'None' });
//       // res.header('Authorization', `Bearer ${token}`).json({ loginStatus: 'success', message: 'Email activation link sent to your inbox.', 'Authorization': `${token}` });
//       res.json({ loginStatus: 'success', message: 'Email activation link sent to your inbox.' });
//     }
//   catch (err) {
//     console.error(err);
//     const errors = handleErrors(err);
//     res.status(200).json({ loginStatus: 'failed', message: errors.email })
//   }
// }


const change_password = async (req, res) => {
  if (newpassword.length > 7) {
    try {
      const { email, oldpassword, newpassword } = req.body;
      const user = await User.check_user_credens(email, oldpassword);
      if (user) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newpassword, salt);
        const updateduser = await User.findOneAndUpdate({ email: email }, { password: hashedPassword });
        res.status(200).json({ "message": "Password updated successfully" });
      }
    }
    catch (err) {
      res.status(400).json(err);
    }
    return;
  }
  res.status(400).json({ "message": "password too short" })
}

const authController = {
  user_login,
  userLoginWithGoogle,
  user_register,
  change_password
}

module.exports = authController;