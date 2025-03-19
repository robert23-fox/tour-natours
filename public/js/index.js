/*eslint-disable*/
import "core-js/stable"; // Polyfill all stable features
import "regenerator-runtime/runtime"; // Polyfill async/await support
import { bookTour } from "./stripe";

import { displayMap } from "./leafletjs";
import { login, logout } from "./login";
import {updateSettings} from "./updateSettings"
import {showSpinner} from "./spinner"
const logOutBtn = document.querySelector(".nav__el--logout")

// DOM ELEMENTS
const  mapLeaflet = document.getElementById("map")
const loginForm = document.querySelector(".form--login");
const userDataForm = document.querySelector(".form-user-data")
const userPasswordForm = document.querySelector(".form-user-password")
const bookBtn = document.getElementById("book-tour")

// VALUES


// Parsing locations data and passing it to the map function
if(mapLeaflet) {
  const locations = JSON.parse(document.getElementById("map").dataset.locations);
  displayMap(locations);
}

// Ensure the form exists before attaching an event listener
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.submitter;
    showSpinner(btn, true); // Start Spinner

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await login(email, password);

    showSpinner(btn, false, "Login"); // Stop Spinner
  });
} else {
  console.log("Form element not found");
}

if (userDataForm) {
  userDataForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.submitter; // Automatically selects the button that triggered the form submit
    showSpinner(btn, true, "Updating..."); // Start Spinner

    const form = new FormData();
    form.append("name", document.getElementById("name").value)
    form.append("email", document.getElementById("email").value)
    form.append("photo", document.getElementById("photo").files[0])
    await updateSettings(form, "data");

    showSpinner(btn, false, "Save settings"); // Stop Spinner
  });
} else {
  console.log("User form not found");
}


if(userPasswordForm){
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = e.submitter;
    showSpinner(btn, true); // Start Spinner

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateSettings({ passwordCurrent, password, passwordConfirm }, "password");

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";

    showSpinner(btn, false, "Save password"); // Stop Spinner
  })
} else {
  console.log("User password form not found")
}


if(logOutBtn) logOutBtn.addEventListener("click", logout)

// toggle the input fields to show the text or to hide it
document.addEventListener("click", (e) => {
  const eyeBtn = e.target.closest(".eye-btn, .eye-icon");

  if (eyeBtn) {
    let passwordInput;

    if (eyeBtn.classList.contains("eye-btn")) {
      // Login form button
      passwordInput = eyeBtn.previousElementSibling;
      const eyeIcon = eyeBtn.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        passwordInput.type = "password";
        eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
      }
    } else if (eyeBtn.classList.contains("eye-icon")) {
      // Settings page eye icon
      passwordInput = document.querySelector(eyeBtn.dataset.target);
      const eyeIconUse = eyeBtn.querySelector("use");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIconUse.setAttribute("xlink:href", "img/icons.svg#icon-eye-slash");
      } else {
        passwordInput.type = "password";
        eyeIconUse.setAttribute("xlink:href", "img/icons.svg#icon-eye");
      }
    }
  }
});

if(bookBtn) bookBtn.addEventListener("click", async e => {
  const btn = e.target
  showSpinner(btn, true); // Start Spinner

  const {tourId} = e.target.dataset
  await bookTour(tourId)
  
  showSpinner(btn, false, "Book tour now!"); // Stop Spinner
})



