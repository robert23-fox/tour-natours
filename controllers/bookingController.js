const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "fallback_test_key");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("../controllers/handlerFactory")

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError("Tour not found", 404));
  }

  if (!req.user || !req.user.email) {
    return next(new AppError("User not authenticated", 401));
  }

  console.log("Render Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
          },
          unit_amount: tour.price * 100
        },
        quantity: 1
      }
    ]
  });

  console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items"],
  });
  

  // 4) Send session as response
  res.status(200).json({
    status: "success",
    session: fullSession,  // Send the session with the expanded line_items
    // clientSecret: session.client_secret
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //This is only TEMPORARY, because is UNSECURE: everyone can make bookins without paying
  const {tour, user, price} = req.query;
  if(!tour && !user && !price) return next()
  await Booking.create({tour, user, price})

  res.redirect(req.originalUrl.split("?")[0])
})

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking)
