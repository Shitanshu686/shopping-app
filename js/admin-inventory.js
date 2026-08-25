// ======================
// ADMIN INVENTORY
// ======================

let inventoryProducts = [];


// ======================
// LOAD INVENTORY
// ======================

async function loadInventory() {

    try {

        const response =
            await apiFetch("/products");

        if (!response) {
            return;
        }

        const responseData =
            await response.json();

        if (!responseData.success) {

            showInventoryMessage(
                responseData.message ||
                "Unable to load inventory."
            );

            return;
        }

        inventoryProducts =
            responseData.data || [];

        renderInventory(
            inventoryProducts
        );

    }
    catch (error) {

        console.error(
            "Failed to load inventory:",
            error
        );

        showInventoryMessage(
            "Unable to load inventory."
        );

    }

}


// ======================
// RENDER INVENTORY
// ======================

function renderInventory(productList) {

    const tableBody =
        document.getElementById(
            "inventoryTableBody"
        );

    tableBody.innerHTML = "";


    if (!productList.length) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7">
                    No products found.
                </td>

            </tr>

        `;

        return;

    }


    productList.forEach(product => {

        const row =
            document.createElement("tr");


        const status =
            getStockStatus(
                product.stock
            );


        row.innerHTML = `

            <td>
                ${product.id}
            </td>

            <td>
                ${product.name}
            </td>

            <td>
                ${product.category}
            </td>

            <td>
                ₹${product.price}
            </td>

            <td>
                ${product.stock}
            </td>

            <td>

                <span
                    class="stock-status ${status.className}">

                    ${status.text}

                </span>

            </td>

            <td>

                <button
                    class="update-stock-button"
                    onclick="updateStock(${product.id})">

                    Update

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ======================
// STOCK STATUS
// ======================

function getStockStatus(stock) {

    if (stock === 0) {

        return {
            text: "Out of Stock",
            className: "out-of-stock"
        };

    }


    if (stock <= 10) {

        return {
            text: "Low Stock",
            className: "low-stock"
        };

    }


    return {
        text: "In Stock",
        className: "in-stock"
    };

}


// ======================
// UPDATE STOCK
// ======================

function updateStock(productId) {

    const product =
        inventoryProducts.find(
            product =>
                product.id === productId
        );


    if (!product) {
        return;
    }


    const newStock =
        prompt(
            `Enter new stock for ${product.name}:`,
            product.stock
        );


    if (newStock === null) {
        return;
    }


    const stock =
        Number(newStock);


    if (
        !Number.isInteger(stock) ||
        stock < 0
    ) {

        showInventoryMessage(
            "Stock must be a valid number greater than or equal to 0."
        );

        return;

    }


    updateProductStock(
        productId,
        stock
    );

}


// ======================
// SAVE STOCK
// ======================

async function updateProductStock(
    productId,
    stock
) {

    const product =
        inventoryProducts.find(
            product =>
                product.id === productId
        );


    if (!product) {
        return;
    }


    try {

        const response =
            await apiFetch(
                `/products/${productId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: product.name,

                        brand: product.brand,

                        description:
                            product.description,

                        price: product.price,

                        oldPrice:
                            product.oldPrice,

                        rating:
                            product.rating,

                        image: product.image,

                        category:
                            product.category,

                        stock: stock

                    })
                }
            );


        if (!response) {
            return;
        }


        const responseData =
            await response.json();


        if (!responseData.success) {

            showInventoryMessage(
                responseData.message ||
                "Unable to update stock."
            );

            return;
        }


        showInventoryMessage(
            "Stock updated successfully."
        );


        await loadInventory();

    }
    catch (error) {

        console.error(
            "Failed to update stock:",
            error
        );

        showInventoryMessage(
            "Unable to update stock."
        );

    }

}


// ======================
// MESSAGE
// ======================

function showInventoryMessage(message) {

    const messageElement =
        document.getElementById(
            "inventoryMessage"
        );


    if (messageElement) {

        messageElement.textContent =
            message;

    }

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

        loadInventory();


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