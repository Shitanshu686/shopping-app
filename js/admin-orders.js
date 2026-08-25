// ======================
// ADMIN ORDER MANAGEMENT
// ======================

let orders = [];


// ======================
// LOAD ALL ORDERS
// ======================

async function fetchAdminOrders() {

    try {

        const response =
            await apiFetch("/orders/admin");

        if (!response) {
            return;
        }

        const responseData =
            await response.json();

        if (!responseData.success) {

            showOrderMessage(
                responseData.message ||
                "Unable to load orders."
            );

            return;
        }

        orders =
            responseData.data || [];

        renderOrders(orders);

        showOrderMessage(
            "Orders loaded successfully."
        );

    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );

        showOrderMessage(
            "Unable to load orders."
        );
    }
}


// ======================
// RENDER ORDERS
// ======================

function renderOrders(orderList) {

    const tableBody =
        document.getElementById(
            "orderTableBody"
        );

    tableBody.innerHTML = "";


    if (!orderList.length) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7">
                    No orders found.
                </td>

            </tr>

        `;

        return;

    }


    orderList.forEach(order => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                #${order.orderId}
            </td>

            <td>
                ${order.fullName || "-"}
            </td>

            <td>
                ${order.phone || "-"}
            </td>

            <td>
                ₹${order.totalAmount || 0}
            </td>

            <td>
                ${order.status || "-"}
            </td>

            <td>
                ${formatOrderDate(order.createdAt)}
            </td>

            <td>

    <button
        class="view-order-button"
        onclick="viewOrder(${order.orderId})">

        View

    </button>

    <select
    class="order-status-select"
    onchange="updateOrderStatus(
        ${order.orderId},
        this.value
    )">

    ${getStatusOptions(order.status)}

</select>

</td>

        `;


        tableBody.appendChild(row);

    });

}

// ======================
// FORMAT DATE
// ======================

function formatOrderDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date)
        .toLocaleDateString("en-IN");

}


// ======================
// VIEW ORDER
// ======================
function viewOrder(orderId) {

    const order =
        orders.find(
            order => order.orderId === orderId
        );

    if (!order) {
        return;
    }

    const modal =
        document.getElementById(
            "orderDetailsModal"
        );

    const content =
        document.getElementById(
            "orderDetailsContent"
        );

    let itemsHTML = "";

    if (
        order.items &&
        order.items.length > 0
    ) {

        itemsHTML = order.items.map(item => {

            return `

                <div class="order-item">

                    <div>

                        <strong>
                            ${item.productName || "-"}
                        </strong>

                        <p>
                            Product ID:
                            ${item.productId || "-"}
                        </p>

                        <p>
                            Quantity:
                            ${item.quantity || 0}
                        </p>

                        <p>
                            Price:
                            ₹${item.price || 0}
                        </p>

                    </div>

                    <div>

                        <strong>
                            ₹${item.subtotal || 0}
                        </strong>

                    </div>

                </div>

            `;

        }).join("");

    } else {

        itemsHTML = `
            <p>No items found.</p>
        `;

    }


    content.innerHTML = `

        <div class="order-detail-section">

            <h3>Customer Details</h3>

            <div class="order-detail-row">
                <strong>Name</strong>
                <span>
                    ${order.fullName || "-"}
                </span>
            </div>

            <div class="order-detail-row">
                <strong>Phone</strong>
                <span>
                    ${order.phone || "-"}
                </span>
            </div>

        </div>


        <div class="order-detail-section">

            <h3>Delivery Address</h3>

            <div class="order-detail-row">
                <strong>Address</strong>
                <span>
                    ${order.address || "-"}
                </span>
            </div>

            <div class="order-detail-row">
                <strong>City</strong>
                <span>
                    ${order.city || "-"}
                </span>
            </div>

            <div class="order-detail-row">
                <strong>State</strong>
                <span>
                    ${order.state || "-"}
                </span>
            </div>

            <div class="order-detail-row">
                <strong>Pincode</strong>
                <span>
                    ${order.pincode || "-"}
                </span>
            </div>

        </div>


        <div class="order-detail-section">

            <h3>Order Items</h3>

            ${itemsHTML}

        </div>


        <div class="order-detail-section">

            <div class="order-detail-row">

                <strong>Order ID</strong>

                <span>
                    #${order.orderId}
                </span>

            </div>

            <div class="order-detail-row">

                <strong>Status</strong>

                <span>
                    ${order.status || "-"}
                </span>

            </div>

            <div class="order-detail-row">

                <strong>Total Amount</strong>

                <span>
                    ₹${order.totalAmount || 0}
                </span>

            </div>

            <div class="order-detail-row">

                <strong>Order Date</strong>

                <span>
                    ${formatOrderDate(order.createdAt)}
                </span>

            </div>

        </div>

    `;

    modal.classList.add("show");
}
// ======================
// MESSAGE
// ======================

function showOrderMessage(message) {

    const messageElement =
        document.getElementById(
            "orderMessage"
        );

    if (messageElement) {

        messageElement.textContent =
            message;

    }

}


// ======================
// PAGE LOAD
// ======================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        fetchAdminOrders();

    }
);

// ======================
// CLOSE ORDER MODAL
// ======================

function closeOrderModal() {

    const modal =
        document.getElementById(
            "orderDetailsModal"
        );

    if (modal) {
        modal.classList.remove("show");
    }
}
// ======================
// UPDATE ORDER STATUS
// ======================

async function updateOrderStatus(orderId, status) {

    const confirmed =
        confirm(
            `Change order #${orderId} status to ${status}?`
        );

    if (!confirmed) {

        await fetchAdminOrders();

        return;
    }


    try {

        const response =
            await apiFetch(
                `/orders/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        if (!response) {
            return;
        }


        const responseData =
            await response.json();


        if (!responseData.success) {

            showOrderMessage(
                responseData.message ||
                "Unable to update order status."
            );

            await fetchAdminOrders();

            return;
        }


        showOrderMessage(
            "Order status updated successfully."
        );


        await fetchAdminOrders();


    } catch (error) {

        console.error(
            "Error updating order status:",
            error
        );

        showOrderMessage(
            "Unable to update order status."
        );

        await fetchAdminOrders();

    }

}
function getStatusOptions(currentStatus) {

    if (currentStatus === "PENDING") {

        return `
            <option value="PENDING" selected>
                Pending
            </option>

            <option value="CONFIRMED">
                Confirmed
            </option>

            <option value="CANCELLED">
                Cancelled
            </option>
        `;
    }


    if (currentStatus === "CONFIRMED") {

        return `
            <option value="CONFIRMED" selected>
                Confirmed
            </option>

            <option value="SHIPPED">
                Shipped
            </option>

            <option value="CANCELLED">
                Cancelled
            </option>
        `;
    }


    if (currentStatus === "SHIPPED") {

        return `
            <option value="SHIPPED" selected>
                Shipped
            </option>

            <option value="DELIVERED">
                Delivered
            </option>
        `;
    }


    if (currentStatus === "DELIVERED") {

        return `
            <option value="DELIVERED" selected>
                Delivered
            </option>
        `;
    }


    if (currentStatus === "CANCELLED") {

        return `
            <option value="CANCELLED" selected>
                Cancelled
            </option>
        `;
    }


    return "";
}