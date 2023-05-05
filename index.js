const mongoose = require("mongoose");
const helmet = require("helmet");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const petfood = require("./routes/petfood");
const user = require("./routes/user");
const auth = require("./routes/auth");

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(helmet());
app.use(express.json());
app.use("/api/v1/petfood", petfood);
app.use("/api/v1/user", user);
app.use("/api/v1/auth", auth);




//app.use(cors());
//app.options('*', cors());

/*app.use(
  cors({
    origin: 'http://localhost',
    credentials: true,
   preflightContinue: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);*/
/*
app.use(
  cors({
    origin: 'http://localhost:3001'
  })
);*/

const HOST = process.env.API_HOST || "localhost";
const PORT = process.env.API_PORT || 3000;

mongoose
  .connect(process.env.MONGODBCONNECTIONSTRING)
  .then(() => console.log("Connected!"))
  .catch((e) => console.log("Error!" + e));

app.listen(PORT, () =>
  console.log(`✅  API Server started: http://${HOST}:${PORT}/api/v1`)
);
