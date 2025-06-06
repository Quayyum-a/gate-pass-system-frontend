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

    let url = `${BASE_URL}${endpoint}`;
    let body = null;

    // Handle login endpoints with query parameters
    if (["/resident/login", "/security/login"].includes(endpoint)) {
      const params = new URLSearchParams(data).toString();
      url += `?${params}`;
    } else {
      body = JSON.stringify(data);
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    const result = await response.json();
    hideLoader();
    if (!response.ok) {
      console.error(
        `API Error: ${response.status} ${response.statusText}`,
        result
      ); // Log for debugging
      throw new Error(result.message || "API request failed");
    }
    return result;
  } catch (error) {
    hideLoader();
    showError(error.message);
    throw error;
  }
}
