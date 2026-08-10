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

    <div class="product-card" data-category="${product.category}">
<div class="wishlist-btn">
    🤍
</div>
        <div class="product-card__discount">
            ${discount}% OFF
        </div>

        <img
    class="product-card__image"
    src="${product.image}"
    alt="${product.name}"
>

        <p class="product-card__brand">
    ${product.brand}
</p>

        <h3 class="product-card__title">
    ${product.name}
</h3>

        <p class="product-card__description">
    ${product.description}
</p>

        <div class="product-card__rating">
    ⭐ ${product.rating}
</div>

        <div class="product-card__price-section">

            <span class="product-card__price">
    ₹${product.price}
</span>

            <span class="product-card__old-price">
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