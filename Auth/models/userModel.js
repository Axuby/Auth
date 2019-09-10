const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const Schema =  mongoose.Schema

const UserSchema = new Schema({
  name:{
    type:String,
    required:[true, 'please input a name!'],
     minLength: 1,
  },
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true, //calls .trim() on the value to get rid of whitespace
    unique: true, //note that the unique option is not a validator; we use mongoose-unique-validator to enforce it
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
});

//this enforces emails to be unique!
UserSchema.plugin(uniqueValidator);

//this function will be called before a document is saved
UserSchema.pre('save', function(next) {
  let user = this;

  if (!user.isModified('password')) {
    return next();
  }

  //we generate the salt using 12 rounds and then use that salt with the received password string to generate our hash
  bcrypt
    .genSalt(12)
    .then((salt) => {
      return bcrypt.hash(user.password, salt);
    })
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((err) => next(err));
});

const  User = mongoose.model('User', UserSchema)
module.exports = User