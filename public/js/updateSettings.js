/*eslint-disable */
import axios from "axios";
import {showAlert} from "./alerts"

//type is either "password" or "data"
export const updateSettings = async (data, type) => {
  try{
    const url = type === "password" ? "http://127.0.0.1:3000/api/v1/users/updateMyPassword" : "http://127.0.0.1:3000/api/v1/users/updateMe"
    const res = await axios({
      method: "PATCH",
      url,
      data
    })

    if(res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfuly!`)
       // window.setTimeout(() => {
       //   location.assign("/me")
       // }, 1500)
    }
  }catch(err){
    showAlert("error", err.response.data.message)
  }
}



// show/hide input fields
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

  document.querySelectorAll('.eye-icon').forEach(icon => {
    icon.addEventListener('click', function () {
      const input = document.querySelector(this.dataset.target);
      input.type = input.type === 'password' ? 'text' : 'password';
      this.classList.toggle('active');
    });
  });
});

