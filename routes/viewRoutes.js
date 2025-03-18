const express = require("express");
const viewController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// ✅ Apply `authController.isLoggedIn` to all views
router.use(authController.isLoggedIn);

router.get("/", bookingController.createBookingCheckout, viewController.getOverview);

router.get("/tour/:slug", viewController.getTour);
router.get('/login', viewController.getLoginForm);
router.get("/me", authController.protect, viewController.getAccount);
router.get("/my-tours", authController.protect, viewController.getMyTours);

module.exports = router;
