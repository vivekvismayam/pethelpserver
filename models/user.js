const mongoose = require("mongoose");
const Joi = require("joi");
const jwt=require('jsonwebtoken');

//Mongoose---------------------------------
const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true,unique : true },
  mobile: { type: Number, unique : true },
  password: { type: String, require: true,minlength:3,maxlength:1024 },
  isAdmin:{type:Boolean,default:false}
});
userSchema.methods.generateAuthToken=function(){
  const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},process.env.JWTPrivateKey);
  return token;
}
const User = mongoose.model("User", userSchema);

//Generate Auth Token

//Validations--------------------------------
function validateUser(req) {
  const schema = Joi.object({
    name: Joi.string().min(0).max(100).required(),
    email: Joi.string().min(0).max(100).required().email(),
    mobile: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
      .required(),
    password: Joi.string().required(),
  });

  console.log("Validate " + JSON.stringify(schema.validate(req.body)));
  return schema.validate(req.body);
}
//Exports---------------------------------
module.exports.User = User;
module.exports.validateUser=validateUser;

