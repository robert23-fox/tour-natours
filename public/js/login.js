/*eslint-disable*/

const login = async (email, password) => {
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
      alert("Logged in successfuly!");
      //reload the page
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    alert(err.response.data.message);
  }
};

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  login(email, password);
});

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
