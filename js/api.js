const BASE_URL = 'http://localhost:8080/api';

const publicEndpoints = [
  "/resident/login",
  "/security/login",
  "/resident/register",
  "/security/register",
];
async function apiCall(endpoint, method, data) {
  try {
    showLoader();
    const session = getSession();
    const headers = {
      "Content-Type": "application/json",
    };
    if (session?.user?.token && !publicEndpoints.includes(endpoint)) {
      headers["Authorization"] = `Bearer ${session.user.token}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
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
