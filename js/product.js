// ======================
// PRODUCT CARD
// ======================

function createProductCard(product) {

    const discount = Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
    );

    let stockStatus = "";

    if (product.stock > 10) {

        stockStatus = `<span class="stock in-stock">🟢 In Stock</span>`;

    }
    else if (product.stock > 0) {

        stockStatus = `<span class="stock low-stock">🟠 Only ${product.stock} Left</span>`;

    }
    else {

        stockStatus = `<span class="stock out-stock">🔴 Out of Stock</span>`;

    }

    return `

    <div class="card">
<div class="wishlist-btn">
    🤍
</div>
        <div class="discount-badge">
            ${discount}% OFF
        </div>

        <img src="${product.image}" alt="${product.name}">

        <p class="brand">${product.brand}</p>

        <h3>${product.name}</h3>

        <p class="description">
            ${product.description}
        </p>

        <div class="rating">
            ⭐ ${product.rating}
        </div>

        <div class="price-section">

            <span class="price">
                ₹${product.price}
            </span>

            <span class="old-price">
                ₹${product.oldPrice}
            </span>

        </div>

        ${stockStatus}

        <button
            class="add-cart-btn"
            data-name="${product.name}"
            data-price="${product.price}">

            🛒 Add to Cart

        </button>

    </div>

    `;
}
// ======================
// RENDER PRODUCTS
// ======================

function renderProducts(products) {

    const productDiv = document.getElementById("products");

    productDiv.innerHTML = "";

    products.forEach(product => {

        productDiv.innerHTML += createProductCard(product);

    });

}