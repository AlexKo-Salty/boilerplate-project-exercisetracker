const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

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

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
