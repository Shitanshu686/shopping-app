// ======================
// ORDER SUCCESS
// ======================


// ======================
// LOAD ORDER
// ======================

async function loadOrder() {

    // ======================
    // GET ORDER ID FROM URL
    // ======================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const orderId =
        params.get("id");


    // ======================
    // ORDER ID CHECK
    // ======================

    if (!orderId) {

        console.error(
            "Order ID not found"
        );

        window.location.href =
            "Shopping.html";

        return;

    }


    // ======================
    // FETCH ORDER
    // ======================

    try {

        const order =
            await fetchOrderById(
                orderId
            );


        if (!order) {

            console.error(
                "Unable to fetch order"
            );

            return;

        }


        // ======================
        // DISPLAY ORDER
        // ======================

        document.getElementById("orderId")
            .textContent =
            order.orderId;


        document.getElementById("orderStatus")
            .textContent =
            order.status;


        document.getElementById("orderTotal")
            .textContent =
            order.totalAmount;


    }
    catch (error) {

        console.error(
            "Failed to load order:",
            error
        );

    }

}


// ======================
// VIEW ORDER
// ======================

function viewOrder() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const orderId =
        params.get("id");


    if (!orderId) {
        return;
    }


    window.location.href =
        `OrderDetails.html?id=${orderId}`;

}


// ======================
// CONTINUE SHOPPING
// ======================

function continueShopping() {

    window.location.href =
        "Shopping.html";

}


// ======================
// START
// ======================

loadOrder();