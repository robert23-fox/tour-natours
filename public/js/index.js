/*eslint-disable*/
import "core-js/stable"; // Polyfill all stable features
import "regenerator-runtime/runtime"; // Polyfill async/await support

import axios from "axios"; // Fixed import
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

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    await updateSettings({ name, email }, "data");

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


  



  
