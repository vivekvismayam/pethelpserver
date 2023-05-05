const mongoose = require("mongoose");
const Joi = require("joi");

//Mongoose---------------------------------
const foodSchema = new mongoose.Schema({
  item: { type: String, require: true },
  desc: { type: String, require: true },
  buyafterday: { type: Number, default: 0 },
  numberOfPack: { type: Number, default: 0 },
  outOfStock: { type: Boolean, default: true },
  imgurl: { type: String },
});
const Food = mongoose.model("Food", foodSchema);

//Validations--------------------------------
function validateStock(req) {
    const schema = Joi.object({
      buyafterday: Joi.number().min(0).max(100).required(),
      numberOfPack: Joi.number().min(0).max(100).required(),
      outOfStock: Joi.boolean().required(),
    });
  
    console.log("Validate " + JSON.stringify(schema.validate(req.body)));
    return schema.validate(req.body);
  }
  function validateItem(req) {
    const schema = Joi.object({
      item: Joi.string().min(3).max(100).required(),
      desc: Joi.string().min(3).max(100).required(),
      imgurl: Joi.string().min(3).required(),
    });
  
    console.log("Validate " + JSON.stringify(schema.validate(req.body)));
    return schema.validate(req.body);
  }
  //Exports---------------------------------
module.exports.Food = Food;
module.exports.validateStock=validateStock;
module.exports.validateItem=validateItem;
