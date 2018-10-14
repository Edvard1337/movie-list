const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const userListSchema = new Schema({
  user_id: {
    type: String,
    required: [true]
  },
  movie_id: {
    type: String,
    required: [true]
  },
  public:{
    type: Boolean,
    required: [true]
  },
  updated:{
    type: Number,
    required: [true]
  }
});

const UserList = mongoose.model('userList', userListSchema);

module.exports = UserList;
