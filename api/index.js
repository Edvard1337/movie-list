const express = require("express");
const bodyParser  = require("body-parser");
const routes  = require("./routes/api");
const mongoose = require("mongoose");

//setup express app
const app = express();

//connect to mongoDB
mongoose.connect("mongodb://localhost/moviego", { useMongoClient: true});
mongoose.Promise = global.Promise;

app.use(express.static("public"));

//initilize body-parser
app.use(bodyParser.json());

//initialize routes
app.use("/api",routes);

//error handling middleware
app.use(function(err, req, res, next){
  console.log(err);
  res.status(422).send({error: err.message});
  res.status(500).send({error: err.message});
});

//listen for request
app.listen(process.env.port || 4000, function(){
  console.log("Now listening for requests");
});
