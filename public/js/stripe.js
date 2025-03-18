import axios from "axios";
import { showAlert } from "./alerts";

/*eslint-disable*/

const stripe = Stripe("pk_test_51R2JCWP7TZlikUXdktsg2xua6I7wtZYvGDef0VoS4l275ZFCOrOErQEO7O3NGlPJn0fuKynRWin2iz4fdAbx8e3900Rg0VtdRK");

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const sessionResponse = await axios.get(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log("Session Data:", sessionResponse.data);
    console.log("Session ID:", sessionResponse.data.session.id);

    // 2) Extract sessionId properly
    const sessionId = sessionResponse.data.session.id;

    // 3) Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error("Stripe Redirect Error:", error);
      showAlert("error", error.message);
    }
  } catch (err) {
    console.error(`There was an error with Stripe: ${err}`);
    showAlert("error", err.response?.data?.message || "Something went wrong!");
  }
};
