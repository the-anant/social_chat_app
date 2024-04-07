const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  uid: { 
    type: String
  },
  username: { 
    type: String, 
    required: [true, "Please enter a username"] 
  },
  profileImage: { 
    type:String
  },
  email: { 
    type: String, 
    required: [true, "Please enter an email"], 
    unique: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: { 
    type: String
  },
  bio:{
    type:String,
    maxlength: [100, "Maximum bio length is 100 characters"]
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  verified:{
    type:Boolean
  },
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
},
{
  strict: true
});

userSchema.pre('save', async function(next) {
  try {
    if(this.password){
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error); // Pass the error to the next middleware
  }
});

userSchema.statics.check_user_credens = async function(email, password) {
  const user = await this.findOne({ email });

  if (user) {
    try {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw new Error("Incorrect Password");
    } catch (err) {
      throw new Error("Incorrect Password");
    }
  } else {
    throw new Error("User not found");
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
