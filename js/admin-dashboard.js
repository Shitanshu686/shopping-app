// ======================
// ADMIN DASHBOARD
// ======================


// ======================
// LOAD DASHBOARD
// ======================

async function loadAdminDashboard() {

    try {

        const response =
            await apiFetch(
                "/admin/dashboard"
            );


        if (!response) {

            showDashboardMessage(
                "Unable to load dashboard."
            );

            return;

        }


        const responseData =
            await response.json();


        // ======================
        // DASHBOARD DATA
        // ======================

        const dashboard =
            responseData.data ||
            responseData;



        // ======================
        // UPDATE CARDS
        // ======================

        document.getElementById(
            "totalProducts"
        ).textContent =
            dashboard.totalProducts;


        document.getElementById(
            "totalUsers"
        ).textContent =
            dashboard.totalUsers;


        document.getElementById(
            "totalOrders"
        ).textContent =
            dashboard.totalOrders;


        document.getElementById(
            "totalRevenue"
        ).textContent =
            dashboard.totalRevenue;

        document.getElementById(
            "lowStockProducts"
        ).textContent =
            dashboard.lowStockProducts;


        document.getElementById(
            "outOfStockProducts"
        ).textContent =
            dashboard.outOfStockProducts;

        renderRecentOrders(
            dashboard.recentOrders || []
        );


        // ======================
        // RENDER RECENT ORDERS
        // ======================

        function renderRecentOrders(orders) {

            const tableBody =
                document.getElementById(
                    "recentOrdersBody"
                );


            if (!tableBody) {
                return;
            }


            tableBody.innerHTML = "";


            if (!orders.length) {

                tableBody.innerHTML = `

            <tr>

                <td colspan="5">
                    No recent orders found.
                </td>

            </tr>

        `;

                return;
            }


            orders.forEach(order => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

            <td>
                #${order.orderId}
            </td>

            <td>
                ${order.customerName}
            </td>

            <td>
                ₹${order.totalAmount}
            </td>

            <td>

                <span class="order-status ${order.status.toLowerCase()}">

                    ${order.status}

                </span>

            </td>

            <td>
                ${formatOrderDate(order.createdAt)}
            </td>

        `;


                tableBody.appendChild(row);

            });

        }
        // ======================
        // FORMAT ORDER DATE
        // ======================

        function formatOrderDate(date) {

            if (!date) {
                return "-";
            }

            return new Date(date).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        }
        // ======================
        // SUCCESS MESSAGE
        // ======================

        showDashboardMessage(
            "Dashboard loaded successfully."
        );

    }
    catch (error) {

        console.error(
            "Failed to load admin dashboard:",
            error
        );


        showDashboardMessage(
            "Unable to load dashboard."
        );

    }

}


// ======================
// DASHBOARD MESSAGE
// ======================

function showDashboardMessage(message) {

    const messageElement =
        document.getElementById(
            "dashboardMessage"
        );


    if (messageElement) {

        messageElement.textContent =
            message;

    }

}


// ======================
// QUICK ACTIONS
// ======================

function openProductManagement() {

    window.location.href =
        "AdminProducts.html";

}


function openUserManagement() {

    window.location.href =
        "AdminUsers.html";

}


function openOrderManagement() {

    window.location.href =
        "admin-orders.html";

}


function openInventoryManagement() {

    window.location.href =
        "admin-inventory.html";

}


// ======================
// LOGOUT
// ======================

function logoutAdmin() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "Login.html";

}


// ======================
// INITIALIZE
// ======================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAdminDashboard();


        const logoutButton =
            document.getElementById(
                "adminLogoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutAdmin
            );

        }

    }
);