const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModul");
const Review = require("../../models/reviewModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"),
);

//IMPORT DATA INTO DB
// run this in the terminal:  node dev-data/data/import-dev-data.js --import
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM DB
// run this in the terminal:  node dev-data/data/import-dev-data.js --delete
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//process.argv[2]: The first user-provided argument (e.g., --import or --delete in this case).
//Think of "argv" as: 🔹 ARGuments Vector (a list/array of arguments passed to the script).
//🔹 "ARGuments we giVe" to the script.
if (process.argv[2] === "--import") {
  importData();
  //run in terminal: node ./dev-data/data/import-dev-data.js --import
  // !!!!!!!!!!! ----IMPORTANT -----------!!!!!!!!!!
  // When you import the date comment the function userSchema.pre("save", function (next) ... that increapts the passwords in the userModel and after you finish to import the data turn it on again by removing the comments
} else if (process.argv[2] === "--delete") {
  deleteData();
  //run in terminal: node ./dev-data/data/import-dev-data.js --delete
}

console.log(process.argv);
