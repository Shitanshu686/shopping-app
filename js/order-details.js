// ======================
// ORDER DETAILS
// ======================


// ======================
// LOAD ORDER
// ======================

async function loadOrderDetails() {

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
        // ORDER SUMMARY
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


        document.getElementById("orderDate")
            .textContent =
            order.createdAt;


        // ======================
        // SHIPPING ADDRESS
        // ======================

        document.getElementById("fullName")
            .textContent =
            order.fullName;


        document.getElementById("phone")
            .textContent =
            order.phone;


        document.getElementById("address")
            .textContent =
            order.address;


        document.getElementById("city")
            .textContent =
            order.city;


        document.getElementById("state")
            .textContent =
            order.state;


        document.getElementById("pincode")
            .textContent =
            order.pincode;


        // ======================
        // ORDER ITEMS
        // ======================

        const orderItems =
            document.getElementById("orderItems");


        orderItems.innerHTML = "";


        order.items.forEach(item => {

            orderItems.innerHTML += `

                <div class="order-item">

                    <h3>
                        ${item.productName}
                    </h3>

                    <p>
                        Product ID:
                        ${item.productId}
                    </p>

                    <p>
                        Price:
                        ₹${item.price}
                    </p>

                    <p>
                        Quantity:
                        ${item.quantity}
                    </p>

                    <p>
                        Subtotal:
                        ₹${item.subtotal}
                    </p>

                </div>

            `;

        });


    }
    catch (error) {

        console.error(
            "Failed to load order details:",
            error
        );

    }

}


// ======================
// GO BACK
// ======================

function goBack() {

    window.history.back();

}


// ======================
// START
// ======================

loadOrderDetails();