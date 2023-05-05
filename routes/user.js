const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");

//Routes---------------------------------
//Get ALL
router.get("/", async (req, res) => {
  const users = await User.find().sort({ name: 1 }).select("-password");
  res.status(200).json(users);
});
//Register
router.post("/", async (req, res) => {
  console.log(
    "Add User " + req.params.id + "  -> Add User | " + JSON.stringify(req.body)
  );

  const validate = validateUser(req);
  if (validate.error)
    return res.status(400).json({ error: validate.error.details[0].message });
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
  });
  if (user)
    return res
      .status(400)
      .send({ error: "Email or Mobile number already registered" });
  const salt = await bcrypt.genSalt(10);
  const hashedpwd = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: hashedpwd,
  });
  newUser
    .save()
    .then(() => {
      console.log("saved");
      return res
        .status(200)
        .json(_.pick(newUser, ["_id", "name", "email", "mobile"]));
    })
    .catch((e) => {
      console.log("Error!" + e);
      return res.status(500).json({ error: e + "" });
    });
});

//Exports---------------------------------
module.exports = router;
