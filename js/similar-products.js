// ======================
// PRODUCT ID
// ======================

const similarParams =
    new URLSearchParams(window.location.search);

const similarProductId =
    similarParams.get("id");


// ======================
// LOAD SIMILAR PRODUCTS
// ======================

async function loadSimilarProducts() {

    try {

        const response =
            await apiFetch(
                `/products/${similarProductId}/similar`
            );

        if (!response) {
            return;
        }

        const responseData =
            await response.json();

        const products =
            responseData.data;

        renderSimilarProducts(products);

    }
    catch (error) {

        console.error(
            "Failed to load similar products:",
            error
        );

    }

}


// ======================
// RENDER SIMILAR PRODUCTS
// ======================

function renderSimilarProducts(products) {

    const container =
        document.getElementById("similarProducts");

    if (!container) {
        return;
    }

    if (!products || products.length === 0) {

        container.innerHTML = `
            <p>No similar products available.</p>
        `;

        return;
    }

    container.innerHTML =
        products.map(product => `

            <div class="similar-product-card">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ⭐ ${product.rating}
                </p>

                <strong>
                    ₹${product.price}
                </strong>

                <div class="similar-product-actions">

    <button
        class="similar-view-btn"
        onclick="viewProduct(${product.id})"
    >
        View Details
    </button>

    <button
        class="similar-cart-btn"
        onclick="addSimilarProductToCart(
            ${product.id},
            '${product.name.replace(/'/g, "\\'")}',
            ${product.price}
        )"
    >
        🛒 Add to Cart
    </button>

</div>

            </div>

        `).join("");

}


// ======================
// VIEW PRODUCT
// ======================

function viewProduct(id) {

    window.location.href =
        `ProductDetails.html?id=${id}`;

}
// ======================
// ADD SIMILAR PRODUCT TO CART
// ======================

function addSimilarProductToCart(
    id,
    name,
    price
) {

    const cartItem = {

        name: name,
        price: price,
        quantity: 1

    };

    localStorage.setItem(
        "pendingCartItem",
        JSON.stringify(cartItem)
    );

    window.location.href =
        "Shopping.html";
}

// ======================
// START
// ======================

loadSimilarProducts();