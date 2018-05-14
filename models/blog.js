const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

let titleLengthChecker = (title) => {
  if(!title){
  }else if(title.length < 5 || title.length > 30){
  }else{
    return true;
  }
  return false;
}

let titleValidChecker = (title) => {  
  const regExp = new RegExp(
    /^[a-zA-Z0-9 ]+$/
  );  
  return regExp.test(title);
}

let bodyLengthChecker = (body) => {
  if(!body){
  }else if(body.length <5 || body.length > 500 ){
  }else{
    return true;
  }
  return false;
}

let commentLengthChecker = (comment) => {
  if(!comment[0]){
  }else if(comment[0].length < 1 || comment[0].length > 200 ){
  }else{
    return true;
  }
  return false;
}

const titleValidators = [
  {
    validator: titleLengthChecker,
    message: 'Title must be between 5 to 30 characters'
  },
  {
    validator: titleValidChecker,
    message: 'Title is invalid'
  }
];

const bodyValidators = [
  {
    validator: bodyLengthChecker,
    message: 'Body must be between 5 to 500 characters'
  }
];

const commentValidators = [
  {
    validator: commentLengthChecker,
    message: 'Comment must be between 1 to 200 characters'
  }
];

const blogSchema = new Schema({
  title: { type:String, required:true, validate: titleValidators },
  body: { type:String, required:true, validate: bodyValidators },
  createdBy: { type:String, required:true },
  createdAt: { type:Date, default: Date.now() },
  likes: { type:Number, default: 0 },
  likedBy: { type:Array },
  dislikes: { type:Number, default: 0 },
  dislikedBy: { type:Array },
  comments: [
    { 
      comment: {type: String, validate: commentValidators },
      commentBy: {type: String }
    }
  ]
});


module.exports = mongoose.model('Blog', blogSchema)