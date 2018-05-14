const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

let emailLengthChecker = (email) => {
  if(!email){
  }else if(email.length < 5 || email.length > 30){
  }else{
    return true;
  }
  return false;
}

let emailValidChecker = (email) => {  
  const regExp = new RegExp(
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  );  
  return regExp.test(email);
}

let usernameLengthChecker = (username) => {
  if(!username){
  }else if(username.length <3 || username.length > 15 ){
  }else{
    return true;
  }
  return false;
}

let usernameValidChecker = (username) => {
  const regExp = new RegExp(
    /^[a-zA-Z0-9]+$/
  );
  return regExp.test(username);
}

let passwordLengthChecker = (password) => {
  if(!password){
  }else if(password.length <8 || password.length > 35 ){
  }else{
    return true;
  }
  return false;
}

let passwordValidChecker = (password) => {
  const regExp = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,35})/
  );
  return regExp.test(password);
}

const emailValidators = [
  {
    validator: emailLengthChecker,
    message: 'Email must be between 5 to 30 characters'
  },
  {
    validator: emailValidChecker,
    message: 'Email is not valid'
  }
];

const usernameValidators = [
  {
    validator: usernameLengthChecker,
    message: 'Username must be between 3 to 15 characters'
  },
  {
    validator: usernameValidChecker,
    message: 'Username must be alphanumeric'
  }
];

const passwordValidators = [
  {
    validator: passwordLengthChecker,
    message: 'Password must be between 8 to 35 characters'
  },
  {
    validator: passwordValidChecker,
    message: 'Password must contain one uppercase, one lowercase, 1 special character and 1 number'
  }
];

const userSchema = new Schema({
  email: { type:String, required:true, unique:true, lowercase:true, validate: emailValidators },
  username: { type:String, required:true, unique:true, lowercase:true, validate: usernameValidators },
  password: { type:String, required:true, validate: passwordValidators },
});

userSchema.pre('save', function(next) {
  if(!this.isModified('password')) return next();

  bcrypt.hash(this.password, null, null, (err, hash) => {
    if(err) return next(err);
    this.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema)