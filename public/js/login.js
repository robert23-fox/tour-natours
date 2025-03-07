import axios from "axios";
import { showAlert } from "./alerts"; 

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfuly!");
      //reload the page
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const eyeBtn = document.querySelector(".eye-btn");
  const passwordInput = document.getElementById("password");

  if (eyeBtn) {
    eyeBtn.addEventListener("click", () => {
      const eyeIcon = eyeBtn.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
      }
    });
  }
});

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/users/logout",
    })

    if(res.data.status === "success") {
      location.reload(true)
    }
  } catch(err) {
    showAlert("error", "Error logging out! Try again.")
  }
}
