const app = require("./app");
const mongoose = require("mongoose");
const express = require("expres ");

import config from "./config/index";

// create a method
// run a method

(async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("DB Connected");

    app.on("error", (err) => {
      console.log("ERROR: ", err);
      throw err;
    });

    app.listen(config.PORT, () => {
      console.log(`app is listening at ${config.PORT}`);
    });
8

  } catch (err) {
    console.log(err);
    throw err;
  }
})();
