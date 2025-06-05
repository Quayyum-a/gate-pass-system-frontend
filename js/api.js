const BASE_URL = "http://localhost:8080/api";

async function apiCall(endpoint, method, data) {
  try {
    showLoader();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getSession().user?.token || ""}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    hideLoader();
    if (!response.ok) {
      throw new Error(result.message || "API request failed");
    }
    return result;
  } catch (error) {
    hideLoader();
    showError(error.message);
    throw error;
  }
}
