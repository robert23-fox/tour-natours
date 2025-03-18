const express = require("express");
// const multer = require("multer");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// const upload = multer({ dest: "public/img/users" })

//3) Routers
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Don't put this middleware protection above the signup, login, forgotPassword, resetPassword. Middlewares run in sequience. This will add authController.protect to all the reqests bellow
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);

router.delete("/deleteMe", userController.deleteMe); //deactivate de account not delete it

//Only the admin will do this tasks
router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
