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

  // Visitor Logs
  const visitorLogsTable = document.getElementById("visitor-logs-table");
  if (visitorLogsTable) {
    let logs = [];
    const loadLogs = async (search = "") => {
      try {
        const data = await apiCall("/api/security/visitor/logs", "POST", {
          search,
        });
        logs = data.logs;
        visitorLogsTable.innerHTML = "";
        logs.forEach((log) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${log.visitorName}</td>
            <td>${log.visitorPhone}</td>
            <td>${log.resident}</td>
            <td>${new Date(log.checkIn).toLocaleString()}</td>
            <td>${
              log.checkOut ? new Date(log.checkOut).toLocaleString() : "N/A"
            }</td>
          `;
          visitorLogsTable.appendChild(row);
        });
      } catch (error) {
        // Error handled in api.js
      }
    };

    document.getElementById("search")?.addEventListener("input", (e) => {
      loadLogs(e.target.value);
    });

    document.getElementById("export-csv")?.addEventListener("click", () => {
      const csv = ["Visitor Name,Phone,Resident,Check-in,Check-out"];
      logs.forEach((log) => {
        csv.push(
          `${log.visitorName},${log.visitorPhone},${log.resident},${new Date(
            log.checkIn
          ).toLocaleString()},${
            log.checkOut ? new Date(log.checkOut).toLocaleString() : "N/A"
          }`
        );
      });
      const blob = new Blob([csv.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "visitor-logs.csv";
      a.click();
      URL.revokeObjectURL(url);
    });

    loadLogs();
  }

  // Profile Management
  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    document.getElementById("fullName").value = user.fullName;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;

    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fullName = document.getElementById("fullName").value;
      const phone = document.getElementById("phone").value;

      if (!validatePhone(phone)) {
        showError("Invalid phone number");
        return;
      }

      try {
        const data = await apiCall("/api/security/profile", "POST", {
          fullName,
          phone,
        });
        setSession({ ...user, fullName, phone }, "security");
        alert("Profile updated successfully");
      } catch (error) {
        // Error handled in api.js
      }
    });
  }

  const passwordForm = document.getElementById("password-form");
  if (passwordForm) {
    passwordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;

      try {
        await apiCall("/api/security/change-password", "POST", {
          currentPassword,
          newPassword,
        });
        alert("Password changed successfully");
        passwordForm.reset();
      } catch (error) {
        // Error handled in api.js
      }
    });
  }

  const profilePictureUpload = document.getElementById(
    "profile-picture-upload"
  );
  if (profilePictureUpload) {
    profilePictureUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById("profile-picture").src = event.target.result;
          // Backend call for upload can be added here
        };
        reader.readAsDataURL(file);
      }
    });
  }
});
