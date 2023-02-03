const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Field is required"],
    maxLength: [50, "String can be only 25 Chars in length"],
    trim: true,
  },
});
