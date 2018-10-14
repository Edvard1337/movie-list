const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username field is required!"]
  },
  password:{
    type: String,
    required: [true, "Password field is required!"]
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
