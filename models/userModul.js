const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    unique: true,
    maxlength: [40, "A user name must have less or equal than 40 characters"],
    minlength: [5, "A user name must have more or equal than 5 characters"],
    trim: true, // Trim spaces
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true, // Fixed typo: was "unnique"
    lowercase: true, // Ensures email is stored in lowercase
    trim: true, // Removes spaces
    validate: [validator.isEmail, "Please provide a valide email"],
  },
  photo: {
    type: String,
    default: "default.jpg", // Default profile picture
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (value) {
        return value === this.password; // Ensures passwordConfirm matches password
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date, //the type is a date
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// When you import the data you will need to comment this function because the password are already increapted
//-------------------------------------Comment when you import the user data----------------------------------

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with the cost 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete confirmPassword field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//-------------------------------------Comment when you import the user data----------------------------------
//  ^
//  | commennt this middlewares when you import the data

userSchema.methods.correctPassword = async function (
  canditatePassword,
  userPassword,
) {
  return await bcrypt.compare(canditatePassword, userPassword);
};

// regular expresion /^find/ - findes all the queries that starts with find
userSchema.pre(/^find/, function (next) {
  //this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    ); // 10 - a base 10 number

    /*1️⃣ User logs in at 12:00 PM, and a JWT is issued (JWTTimestamp = 1700000000).
      2️⃣ At 12:30 PM, the user changes their password (passwordChangedAt = 1700001800).
      3️⃣ Later, they try using the old token issued before 12:30 PM.

      🔽 What happens?*/
    return JWTTimestamp < changedTimestamp; //true
  }

  return false; //By default the user does not change the password
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
