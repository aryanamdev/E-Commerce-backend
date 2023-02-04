const mongoose = require("mongoose");
const { authRoles } = require("../utils/authRoles");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/index.js");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
      maxLength: [50, "String can be only 25 Chars in length"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],

      // This field will not come when we send it to the frontend.
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(authRoles),
      default: authRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password
UserSchema.pre("save", async function (next) {
  if (!this.modified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const { JWT_EXPIRY, JWT_SECRET } = config;

UserSchema.methods = {
  //Comparing Passwords
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  // Generating JWT Token
  getJwtToken: function () {
    const { JWT_EXPIRY, JWT_SECRET } = config;

    return JWT.sign(
      {
        _id: this._id,
        role: this.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
      }
    );
  },
};

module.exports = mongoose.model("User", UserSchema);
