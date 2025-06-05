document.addEventListener("DOMContentLoaded", () => {
  const { user, userType } = getSession();
  if (!user || userType !== "security") {
    window.location.href = "../login.html";
    return;
  }

  const verifyTokenForm = document.getElementById("verify-token-form");
  if (verifyTokenForm) {
    verifyTokenForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = document.getElementById("token").value;

      try {
        const data = await apiCall("/api/security/verify/token", "POST", {
          token,
        });
        const tokenResult = document.getElementById("token-result");
        document.getElementById("visitor-name").textContent = data.visitorName;
        document.getElementById("visitor-phone").textContent =
          data.visitorPhone;
        document.getElementById("whom-to-see").textContent = data.whomToSee;
        tokenResult.classList.remove("hidden");
      } catch (error) {
        // Error handled in api.js
      }
    });
  }
});
