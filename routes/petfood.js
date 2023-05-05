const express = require("express");
const router = express.Router();
const _ = require("lodash");
const{Food,validateItem,validateStock}=require('../models/petfood');
const auth=require('../middleware/auth')
const admin=require('../middleware/admin')
const rescors=require('../middleware/rescors')


//Routes---------------------------------
//Get ALL
router.get("/",auth,async (req, res) => {
  console.log('Requested petfood')
  const foods = await Food.find();
  res.status(200).json(foods);
});
//update stock
router.put("/:id",auth, async (req, res) => {
  console.log(
    "update Item " +
      req.params.id +
      "  -> update Item | " +
      JSON.stringify(req.body)
  );
  const validate = validateStock(req);
  if (validate.error)
    return res.status(400).json({ error: validate.error.details[0].message });

  const food = await Food.findById(req.params.id);
  if (!food) return res.status(400).send({ erorr: "invalid Id" });

  food.buyafterday = req.body.buyafterday;
  food.numberOfPack = req.body.numberOfPack;
  food.outOfStock = req.body.outOfStock;
  food
    .save()
    .then(() => {
      console.log("saved");
      return res
        .status(200)
        .json(_.pick(food, ["_id","item","buyafterday","numberOfPack","outOfStock"]));
    })
    .catch((e) => {
      console.log("Error!" + e);
        return res.status(500).json({ error: e+"" });;
    });
});
//update items
router.put("/admintask/:id",[auth,admin], async (req, res) => {
  console.log(
    "update Item " +
      req.params.id +
      "  -> update Item | " +
      JSON.stringify(req.body)
  );
  const validate = validateItem(req);
  if (validate.error)
    return res.status(400).json({ error: validate.error.details[0].message });

  const food = await Food.findById(req.params.id);
  if (!food) return res.status(400).send({ error: "invalid Id" });

  (food.item = req.body.item),
    (food.desc = req.body.desc),
    (food.imgurl = req.body.imgurl);
  food
    .save()
    .then(() => {
      console.log("saved");
      return res
        .status(200)
        .json(_.pick(food, ["_id", "item", "desc", "imgurl"]));
    })
    .catch((e) => {
      console.log("Error!" + e);
      return res
        .status(500)
        .json({ error: e+"" });
    });
});

//Add items
router.post("/admintask",[auth,admin], async (req, res) => {
  console.log(
    "Add Item " + req.params.id + "  -> Add Item | " + JSON.stringify(req.body)
  );
  
  const validate = validateItem(req);
  if (validate.error)
    return res.status(400).json({ error: validate.error.details[0].message });

  const newfood = new Food({
    item: req.body.item,
    desc: req.body.desc,
    imgurl: req.body.imgurl,
  });
  newfood
    .save()
    .then(() => {
      console.log("saved");
      return res
        .status(200)
        .json(_.pick(newfood, ["_id", "item", "desc", "imgurl"]));
    })
    .catch((e) => {
      console.log("Error!" + e);
      return res
        .status(500)
        .json({ error: e+"" });
    });
});

//Delete items
router.delete("/admintask/:id",[auth,admin], async (req, res) => {
  console.log("Delete Item " + req.params.id );
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(400).send({ error: "invalid Id" });

  food
    .deleteOne()
    .then(() => {
      console.log("Deleted");
      return res
        .status(200)
        .json(_.pick(food, ["_id", "item", "desc", "imgurl"]));
    })
    .catch((e) => {
      console.log("Error!" + e);
      return res
        .status(500)
        .json({ error: e+"" });
    });
});

//Exports---------------------------------
module.exports = router;
