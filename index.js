const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));

//Config Mongoose
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)

//Set up User Schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true}
})

let User = mongoose.model('User',userSchema);

//Set up Exercise Schema
const exerciseSchema = new Schema({
  userid: { type: String, required: true},
  description: { type:String, required: true},
  duration: { type:Number, required: true},
  date: { type: Date, required: true}
})

let Exercise = mongoose.model('Exercise', exerciseSchema)

app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

//Create & Get Users
app.route('/api/users')
  .get((req, res) => {
    User.find({},function(err, data) {
      if (err) return console.error(err);
      res.json(data);
    })
  })
  .post((req, res) => {
    let newUser = new User({
      username: req.body.username
    })

    newUser.save(function(err, data) {
      if (err) return console.log(err);
      res.json(data);
    })
  })

//Create Exercise
app.post('/api/users/:_id/exercises',function(req, res) {
  //Check if user can be find, if not, return user not found
  User.findById(req.body[":_id"], function (err, data) {
    if (err) return console.log(err);
    if (data)
    {
      //
      let username = data.username;
      //Check if date string is exist, if yes, convert to date, if not, apply current date
      let newExercise = new Exercise({
        userid: req.body[":_id"],
        description: req.body.description,
        duration: req.body.duration,
        date: (req.body.date) ? new Date(req.body.date) : new Date()
      })

      newExercise.save(function(err, data) {
        if (err) return console.log(err);
        console.log(username);
        res.json({
          username: username,
          description: data.description,
          duration: data.duration,
          date: data.date,
          _id: data.userid
        });
      })
    }
    else
    {
      res.json({Error: "Invaild user id."});
    }
  })  
})

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
