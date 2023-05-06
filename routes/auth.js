const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//Routes---------------------------------
//Get ALL Users
router.get("/", async (req, res) => {
  const users = await User.find().sort({ name: 1 }).select("-password");
  res.status(200).json(users);
});
//Authorize
router.post("/", async (req, res) => {
  console.log(" Auth | "); //+ JSON.stringify(req.body));
  const validate = validateUser(req);
  if (validate.error)
    return res.status(400).json({ error: validate.error.details[0].message });
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ error: "Invalid Email or Password" });

  const validPwd = await bcrypt.compare(req.body.password, user.password);
  if (!validPwd)
    return res.status(400).send({ error: "Invalid Email or Password" });

  const token = user.generateAuthToken();
  res.cookie('x-auth-token',token,{httpOnly:true,secure:false,path:'/',domain:process.env.ALLOWED_CORS});
  return res.status(200).send({ 'authorization':true,name:user.name,isAdmin:user.isAdmin });
});
//logout
router.delete("/", async (req, res) => {
  console.log(" Logout | "); //+ JSON.stringify(req.body));
  //res.cookie('x-auth-token','',{httpOnly:true,secure:false,path:'/'});
  res.clearCookie('x-auth-token');
  return res.status(200).send({'logout':true});
});
//Validations--------------------------------
function validateUser(req) {
  const schema = Joi.object({
    email: Joi.string().min(0).max(100).required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(req.body);
}
//Exports---------------------------------
module.exports = router;
