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

// ======================
// CART API
// ======================

async function fetchCart() {

    const response =
        await apiFetch("/cart");

    if (!response) {
        return null;
    }

    const responseData =
        await response.json();

    return responseData.data;
}
// ======================
// ORDER API
// ======================

// ======================
// PLACE ORDER
// ======================
// ======================
// PLACE ORDER
// ======================

async function placeOrder(orderData) {

    const response =
        await apiFetch(
            "/orders",
            {
                method: "POST",

                body: JSON.stringify(
                    orderData
                )
            }
        );

    if (!response) {
        return null;
    }

    const responseData =
        await response.json();

    // ======================
    // PLACE ORDER
    // ======================

    async function placeOrder(orderData) {

        const response =
            await apiFetch(
                "/orders",
                {
                    method: "POST",

                    body: JSON.stringify(
                        orderData
                    )
                }
            );

        if (!response) {
            return null;
        }

        const responseData =
            await response.json();

        return responseData.data;
    }

    return responseData.data;
}

// ======================
// FETCH SINGLE ORDER
// ======================

async function fetchOrderById(orderId) {

    const response =
        await apiFetch(
            `/orders/${orderId}`
        );

    if (!response) {
        return null;
    }

    const responseData =
        await response.json();

    return responseData.data;
}
// ======================
// FETCH ORDER HISTORY
// ======================

async function fetchOrders() {

    const response =
        await apiFetch(
            "/orders"
        );

    if (!response) {
        return null;
    }

    const responseData =
        await response.json();

    return responseData.data;
}
// ======================
// ADD PRODUCT TO CART
// ======================

async function addProductToCart(
    productId,
    quantity
) {

    const response =
        await apiFetch(
            "/cart",
            {
                method: "POST",

                body: JSON.stringify({

                    productId: productId,

                    quantity: quantity

                })
            }
        );

    if (!response) {
        return null;
    }

    const responseData =
        await response.json();

    return responseData.data;
}


// ======================
// UPDATE CART QUANTITY
// ======================

async function updateCartQuantity(
    itemId,
    quantity
) {

    const response =
        await apiFetch(
            `/cart/${itemId}`,
            {
                method: "PUT",

                body: JSON.stringify({

                    quantity: quantity

                })
            }
        );

    if (!response) {
        return null;
    }

    const responseData =
        await response.json();

    return responseData.data;
}


// ======================
// REMOVE CART ITEM
// ======================

async function removeCartItem(
    itemId
) {

    const response =
        await apiFetch(
            `/cart/${itemId}`,
            {
                method: "DELETE"
            }
        );

    if (!response) {
        return null;
    }

    const responseData =
        await response.json();

    return responseData.data;
}