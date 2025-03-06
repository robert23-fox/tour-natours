/*eslint-disable*/
import "core-js/stable"; // Polyfill all stable features
import "regenerator-runtime/runtime"; // Polyfill async/await support

import axios from "axios"; // Fixed import
import { displayMap } from "./leafletjs";
import { login } from "./login";

// Parsing locations data and passing it to the map function
const locations = JSON.parse(document.getElementById("map").dataset.locations);
displayMap(locations);

// Ensure the form exists before attaching an event listener
const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
} else {
  console.log("Form element not found");
}
