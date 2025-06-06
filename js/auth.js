document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const toggleButtons = document.querySelectorAll(".auth__toggle-button");

  if (toggleButtons.length) {
    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        toggleButtons.forEach((btn) =>
          btn.classList.remove("auth__toggle-button--active")
        );
        button.classList.add("auth__toggle-button--active");
      });
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const type = document.querySelector(".auth__toggle-button--active")
        .dataset.type;

      if (!validateEmail(email)) {
        showError("Invalid email format");
        return;
      }

      try {
        const endpoint =
          type === "resident" ? "/resident/login" : "/security/login";
        const data = await apiCall(endpoint, "POST", { email, password });
        setSession(data.user, type);
        window.location.href =
          type === "resident"
            ? "resident/dashboard.html"
            : "security/dashboard.html";
      } catch (error) {
        showError(error.message || "Login failed. Please try again.");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const phone = document.getElementById("phone").value;
      const address = document.getElementById("address")?.value;
      const terms = document.getElementById("terms").checked;

      if (!validateEmail(email)) {
        showError("Invalid email format");
        return;
      }
      if (!validatePhone(phone)) {
        showError("Invalid phone number");
        return;
      }
      if (!terms) {
        showError("You must accept the terms");
        return;
      }

      try {
        const isResident = window.location.pathname.includes("resident");
        const endpoint = isResident
          ? "/resident/register"
          : "/security/register";
        const data = {
          fullName,
          email,
          password,
          phone,
          ...(isResident && { address }),
        };
        console.log("Request Body:", data);
        const response = await apiCall(endpoint, "POST", data);
        if (response && response.user) {
          setSession(response.user, isResident ? "resident" : "security");
          window.location.href = isResident
            ? "resident/dashboard.html"
            : "security/dashboard.html";
        } else {
          console.error("Invalid response from API");
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearSession();
      window.location.href = "../login.html";
    });
  }
});
