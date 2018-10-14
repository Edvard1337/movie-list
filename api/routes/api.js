const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const User  = require("../models/user");
const UserList  = require("../models/userList");
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require ("../configuration");
const bcrypt = require("bcryptjs");




//gets the list of movies
router.get("/movies", function(req, res, next){
  console.log("called");
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  JWT.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

  UserList.find({user_id: decoded.id}).then(function(userList){
    if(userList){
      console.log("There are movies");
      var movieListUser = [];
      var items = 0;
      userList.forEach(function(value, index){
          Movie.findById({_id: value.movie_id}).then(function(movie){
            console.log(value.movie_id);
            movieListUser.push({
              name: movie.name,
              year: movie.year,
              userListID: value._id,
              public: value.public
            });
            items++;
            if(items == userList.length){
              res.status(200).send(movieListUser);
            }
          });
      });
    }
    else{
      return res.status(200).send({
        error: "No movies found"
      })
    }
  });
})
});

//add new movie
router.post("/movies", function(req,res,next){

  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  JWT.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    Movie.findOne({"name": req.body.name, "year": req.body.year}, function(err, movie){

      if (!movie){
        Movie.create({"name": req.body.name, "year": req.body.year}).then(function(movie2){
          console.log(req.body);
          UserList.create({
            "user_id": decoded.id,
            "movie_id": movie2._id,
            "public": req.body.public,
            "updated": Date.now()
          }).catch(next);

          return res.status(200).send("Movie didnt exist and has been added and connected to user");
        }).catch(next);

      }else{
        if(UserList.findOne({"movie_id": movie._id, "user_id": decoded.id })){
          console.log("got  here");
          return res.status(500).send("Movie already exists and has already been connected to user");
        }
        console.log("debug3" + movie);
        UserList.create({
          "user_id": decoded.id,
          "movie_id": movie._id,
          "public": req.body.public,
          "updated": Date.now()
        }).catch(next);
        return res.status(200).send("Movie did exist and has been connected to user");
      }
    });
  });
});

//Get list of users

router.get("/users", function(req, res){
  console.log("get userlist called!");
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  JWT.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      User.findOne({"_id": decoded.id}, function(err, user){
          res.status(200).send(user);
      });
});
});

//Register user
router.post("/users", function(req,res,next){
  if(req.body.password.length < 4){
    return res.status(500).send("Password needs to be 4 symbols or more!");
  }
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.findOne({
    "username": req.body.username}, function(err, user){
      if(user){
        console.log("User exists");
      }else{
        User.create({
          username: req.body.username,
          password : hashedPassword
        },
        function (err, user) {
           if (err) return res.status(500).send("There was a problem registering the user.")
           var token = JWT.sign({ id:req.params.id }, JWT_SECRET, {
             expiresIn: 86400 // expires in 24 hours
           });
           console.log(token);
          res.status(200).send({auth: true, token: token, redirect: '/yourList' });
         });
      }
    })
 });

//login user
 router.post('/login', function(req, res) {
  User.findOne({ "username": req.body.username }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      console.log("Invalid password");
      return res.status(401).send({ auth: false, token: null })
    };
    var token = JWT.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({auth: true, token: token, redirect: '/yourList' });
    console.log("Logged in!");
  });
});

//Logout user
router.get('/logout', function(req, res) {
  res.status(200).send({auth: false, token: null, redirect: '/login' });
  console.log("Logged out");
});


//delete movie
router.delete("/userList/:id", function(req, res, next){
  UserList.findByIdAndRemove({_id: req.params.id}).then(function(movie){
    res.send(movie);
  });
});



module.exports = router;
