document.addEventListener("DOMContentLoaded", () => {
  const { user, userType } = getSession();
  if (!user || userType !== "resident") {
    window.location.href = "../login.html";
    return;
  }

  const userNameElement = document.getElementById("user-name");
  if (userNameElement) {
    userNameElement.textContent = user.fullName;
  }

  const generateTokenForm = document.getElementById("generate-token-form");
  if (generateTokenForm) {
    generateTokenForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const visitorName = document.getElementById("visitor-name").value;
      const visitorPhone = document.getElementById("visitor-phone").value;
      const whomToSee = document.getElementById("whom-to-see").value;

      if (!validatePhone(visitorPhone)) {
        showError("Invalid phone number");
        return;
      }

      try {
        const data = await apiCall("/api/resident/generate/code", "POST", {
          visitorName,
          visitorPhone,
          whomToSee,
        });
        const tokenResult = document.getElementById("token-result");
        const generatedToken = document.getElementById("generated-token");
        generatedToken.textContent = data.token;
        tokenResult.classList.remove("hidden");
        document.getElementById("copy-token").addEventListener("click", () => {
          navigator.clipboard.writeText(data.token);
          alert("Token copied!");
        });
      } catch (error) {
        // Error handled in api.js
      }
    });
  }

  // Placeholder for dashboard stats
  if (document.getElementById("tokens-generated")) {
    document.getElementById("tokens-generated").textContent = "10"; // Mock data
    document.getElementById("active-visitors").textContent = "3"; // Mock data
  }
});
