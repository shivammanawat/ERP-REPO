var mongoose= require("mongoose");

var uniqueValidator = require('mongoose-unique-validator');

var prospectSchema = new mongoose.Schema(
{
      id:{type:Number, required: true, unique: true} ,
      name: { type: String, required: true },
      description: {type:String,required: true},
      handler:{type:String,required: true}
});
prospectSchema.plugin(uniqueValidator);


module.exports = mongoose.model("Prospect",prospectSchema);