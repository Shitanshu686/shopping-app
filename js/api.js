// ======================
// API MODULE
// ======================

const API_BASE_URL =
    "http://localhost:8080";


// ======================
// COMMON API FETCH
// ======================

async function apiFetch(
    endpoint,
    options = {}
) {

    const token =
        localStorage.getItem("token");


    const headers = {

        "Content-Type":
            "application/json",

        ...options.headers

    };


    // ======================
    // ADD JWT
    // ======================

    if (token) {

        headers["Authorization"] =
            `Bearer ${token}`;

    }


    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers: headers
            }
        );


    // ======================
    // JWT EXPIRED / INVALID
    // ======================

    if (response.status === 401) {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href =
            "Login.html";

        return null;

    }


    // ======================
    // FORBIDDEN
    // ======================

    if (response.status === 403) {

        console.error(
            "Access denied."
        );

        return null;

    }


    // ======================
    // OTHER HTTP ERRORS
    // ======================

    if (!response.ok) {

        console.error(
            `API Error: ${response.status}`
        );

        return response;

    }


    return response;

}


// ======================
// FETCH PRODUCTS
// ======================

async function fetchProducts() {

    const response =
        await apiFetch("/products");


    const responseData =
        await response.json();


    return responseData.data;

}