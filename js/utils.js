function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

function showError(message) {
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}

function hideError() {
  document.getElementById("error-message").classList.add("hidden");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\+?\d{10,15}$/.test(phone);
}

function setSession(user, type) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("userType", type);
}

function getSession() {
  return {
    user: JSON.parse(localStorage.getItem("user")),
    userType: localStorage.getItem("userType"),
  };
}

function clearSession() {
  localStorage.removeItem("user");
  localStorage.removeItem("userType");
}
