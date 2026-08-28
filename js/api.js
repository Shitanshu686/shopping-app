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

async function fetchProducts(
    page = 0,
    size = 20,
    sortBy = "",
    direction = ""
) {
    let endpoint = `/products?page=${page}&size=${size}`;

    // Spring Boot Pageable standard format: sort=fieldName,asc/desc
    if (sortBy && direction) {
        endpoint += `&sort=${sortBy},${direction}`;
    }

    const response = await apiFetch(endpoint);

    if (!response || !response.ok) {
        return { content: [], number: 0, totalPages: 0 };
    }

    const responseData = await response.json();
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



    const order =
        responseData.data;

    if (!order) {
        return null;
    }

    return {
        orderId:
            order.orderId,

        totalAmount:
            order.totalAmount
    };
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
// ======================
// PAYMENT API
// ======================


// ======================
// CREATE PAYMENT ORDER
// ======================

async function createPaymentOrder(
    orderId,
    amount
) {

    const response =
        await apiFetch(
            `/payments/create?orderId=${orderId}&amount=${amount}`,
            {
                method: "POST"
            }
        );


    if (!response) {
        return null;
    }


    const responseData =
        await response.json();


    if (!responseData.success) {

        console.error(
            "Payment order creation failed:",
            responseData.message
        );

        return null;
    }


    return responseData;
}


// ======================
// VERIFY PAYMENT
// ======================

async function verifyPayment(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
) {

    const response =
        await apiFetch(
            `/payments/verify?razorpayOrderId=${encodeURIComponent(razorpayOrderId)}&razorpayPaymentId=${encodeURIComponent(razorpayPaymentId)}&razorpaySignature=${encodeURIComponent(razorpaySignature)}`,
            {
                method: "POST"
            }
        );


    if (!response) {
        return null;
    }


    const responseData =
        await response.json();


    return responseData;
}
// ======================
// MARK PAYMENT AS FAILED
// ======================

async function markPaymentAsFailed(
    razorpayOrderId
) {

    const response =
        await apiFetch(
            `/payments/fail?razorpayOrderId=${encodeURIComponent(
                razorpayOrderId
            )}`,
            {
                method: "POST"
            }
        );


    if (!response) {
        return null;
    }


    const responseData =
        await response.json();


    return responseData;
}