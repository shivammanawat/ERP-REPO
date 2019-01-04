// var mongoose= require("mongoose");
// var uniqueValidator = require('mongoose-unique-validator');
// var passportLocalMongoose = require("passport-local-mongoose");


// var userSchema= new mongoose.Schema(
// {
//     username:{type:String,required:true, unique: true},
//     password:{type:String,required:true}
// });
// userSchema.plugin(uniqueValidator);

// userSchema.plugin(passportLocalMongoose);

// module.exports= mongoose.model("User",userSchema);

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);