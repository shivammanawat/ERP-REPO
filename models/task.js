var mongoose= require("mongoose");

var uniqueValidator = require('mongoose-unique-validator');

var taskSchema = new mongoose.Schema(
{
   id: {type:Number, required: true,unique :true} ,
   name:{ type: String, required: true },
   description: {type:String,required: true},
   handler:{type:String,required: true},
   clientname:{type:String,required: true},
   status:{type:String,required: true}
});

taskSchema.plugin(uniqueValidator);


module.exports= mongoose.model("Task",taskSchema);
