// ======================
// ORDER HISTORY
// ======================


// ======================
// LOAD ORDERS
// ======================

async function loadOrders() {

    const ordersContainer =
        document.getElementById("ordersContainer");

    const noOrdersMessage =
        document.getElementById("noOrdersMessage");


    try {

        const orders =
            await fetchOrders();


        // ======================
        // NO ORDERS
        // ======================

        if (!orders || orders.length === 0) {

            noOrdersMessage.style.display =
                "block";

            return;

        }


        // ======================
        // RENDER ORDERS
        // ======================

        ordersContainer.innerHTML = "";


        orders.forEach(order => {

            ordersContainer.innerHTML += `

                <div class="order-card">

                    <h2>
                        Order #${order.orderId}
                    </h2>

                    <p>
                        <strong>Status:</strong>
                        ${order.status}
                    </p>

                    <p>
                        <strong>Total:</strong>
                        ₹${order.totalAmount}
                    </p>

                    <p>
                        <strong>Order Date:</strong>
                        ${order.createdAt}
                    </p>

                    <p>
                        <strong>Items:</strong>
                        ${order.items.length}
                    </p>


                    <button
                        onclick="viewOrder(${order.orderId})">

                        View Order

                    </button>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "Failed to load order history:",
            error
        );

        ordersContainer.innerHTML = `

            <p>
                Unable to load orders.
            </p>

        `;

    }

}


// ======================
// VIEW ORDER
// ======================

function viewOrder(orderId) {

    window.location.href =
        `OrderDetails.html?id=${orderId}`;

}


// ======================
// START
// ======================

loadOrders();