// ======================
// API MODULE
// ======================

const API_BASE_URL = "http://localhost:8080";

async function fetchProducts() {

    const response = await fetch(`${API_BASE_URL}/products`);

    const responseData = await response.json();

    return responseData.data;
}